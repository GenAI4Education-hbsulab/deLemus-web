import { openai } from "@/app/openai";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

const MAX_RETRIES = 3;

export async function POST(request: NextRequest) {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const formData = await request.formData();
      const audioFile = formData.get("audio") as File | null;
      let inputContent: string;

      if (audioFile) {
        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: "whisper-1",
        });
        inputContent = transcription.text;
      } else {
        inputContent = formData.get("content") as string;
        if (!inputContent) {
          return new Response(
            JSON.stringify({ error: "No content provided" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      }

      console.log("Input content:", inputContent);
      // Call OpenAI completion API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-ca",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: inputContent,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      // Send the full response back to the client
      return new Response(
        JSON.stringify({
          content: completion.choices[0].message.content,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        return new Response(
          JSON.stringify({
            error: "Failed to process request after retries",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          },
        );
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * retries)); // Exponential backoff
    }
  }
}
