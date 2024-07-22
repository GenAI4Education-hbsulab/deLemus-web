import { openai } from "@/app/openai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Create a new assistant
export async function POST(req: NextRequest) {
  try {
    const { name, instructions, model, tools } = await req.json();

    const assistant = await openai.beta.assistants.create({
      name: name || "Quickstart Assistant",
      instructions: instructions || "You are a helpful assistant.",
      model: model || "gpt-4-1106-preview",
      tools: tools || [
        { type: "code_interpreter" },
        { type: "retrieval" },
        {
          type: "function",
          function: {
            name: "get_current_weather",
            description: "Get the current weather in a given location",
            parameters: {
              type: "object",
              properties: {
                location: {
                  type: "string",
                  description: "The city and state, e.g. San Francisco, CA",
                },
                unit: { type: "string", enum: ["celsius", "fahrenheit"] },
              },
              required: ["location"],
            },
          },
        },
      ],
      description:
        "An AI assistant that helps with various tasks including coding and information retrieval.",
      metadata: {
        created_by: "Your App Name",
        version: "1.0",
      },
    });

    return NextResponse.json(
      { assistantId: assistant.id, assistant: assistant },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating assistant:", error);
    return NextResponse.json(
      { error: "Failed to create assistant" },
      { status: 500 },
    );
  }
}

// Get all assistants
export async function GET() {
  try {
    const assistants = await openai.beta.assistants.list({
      order: "desc",
      limit: 20,
    });

    return NextResponse.json(assistants.data);
  } catch (error) {
    console.error("Error fetching assistants:", error);
    return NextResponse.json(
      { error: "Failed to fetch assistants" },
      { status: 500 },
    );
  }
}
