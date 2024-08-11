import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params: { threadId } }: { params: { threadId: string } },
) {
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;
  let content: string;

  if (audioFile) {
    // Convert audio to text using OpenAI's Whisper API
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
    });
    content = transcription.text;
  } else {
    // Handle text input
    content = formData.get("content") as string;
  }

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: content,
  });

  const stream = openai.beta.threads.runs.stream(threadId, {
    assistant_id: assistantId,
  });

  return new Response(stream.toReadableStream());
}
