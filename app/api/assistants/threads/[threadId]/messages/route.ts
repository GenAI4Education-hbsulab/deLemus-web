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

export async function POST(
  request: NextRequest,
  { params: { threadId } }: { params: { threadId: string } },
) {
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
      if (!content) {
        log("warn", `No content provided for thread ${threadId}`);
        return new Response(JSON.stringify({ error: "No content provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    log("info", `Creating message for thread ${threadId}`);
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: content,
    });

    log("info", `Starting stream for thread ${threadId}`);
    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id: assistantId,
    });

    return new Response(stream.toReadableStream());
  } catch (error) {
    log(
      "error",
      `Error in POST /api/assistants/threads/${threadId}/messages:`,
      error,
    );

    if (error instanceof Error) {
      if (error.message.includes("OpenAI API")) {
        return new Response(JSON.stringify({ error: "OpenAI API error" }), {
          status: 502,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
