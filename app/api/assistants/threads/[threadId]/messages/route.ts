import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

// Simple logging function
function log(
  level: "info" | "warn" | "error",
  message: string,
  ...args: any[]
) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}`, ...args);
}

async function waitForRunCompletion(threadId: string, runId: string) {
  while (true) {
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    if (
      run.status === "completed" ||
      run.status === "failed" ||
      run.status === "cancelled"
    ) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }
}

const MAX_RETRIES = 3;
let retries = 0;

export async function POST(
  request: NextRequest,
  { params: { threadId } }: { params: { threadId: string } },
) {
  while (retries < MAX_RETRIES) {
    try {
      const formData = await request.formData();
      const audioFile = formData.get("audio") as File | null;
      let content: string;

      if (audioFile) {
        log("info", `Processing audio file for thread ${threadId}`);
        // Convert audio to text using OpenAI's Whisper API
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
        });
        content = transcription.text;
        log("info", `Audio transcription completed for thread ${threadId}`);
      } else {
        // Handle text input
        content = formData.get("content") as string;
        console.log("content", content);
        if (!content) {
          log("warn", `No content provided for thread ${threadId}`);
          return new Response(
            JSON.stringify({ error: "No content provided" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      // Check for active runs
      const runs = await openai.beta.threads.runs.list(threadId);
      const activeRun = runs.data.find((run) => run.status === "in_progress");
      console.log("flag 1");

      if (activeRun) {
        log(
          "info",
          `Waiting for active run ${activeRun.id} to complete for thread ${threadId}`,
        );
        await waitForRunCompletion(threadId, activeRun.id);
      }

      log("info", `Creating message for thread ${threadId}`);
      console.log("flag 2");
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: content,
      });

      log("info", `Starting stream for thread ${threadId}`);
      const stream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: assistantId,
      });

      return new Response(stream.toReadableStream(), {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error; // Rethrow if max retries reached
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    }
  }
}
