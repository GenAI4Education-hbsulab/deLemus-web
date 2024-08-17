import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Define a schema for request validation
const MessageSchema = z.object({
  userId: z.string(),
  message: z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  }),
  timestamp: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  console.log("[POST] /api/chat-history - Request received");

  try {
    // Authentication check
    const { userId: authenticatedUserId } = auth();
    if (!authenticatedUserId) {
      console.log(
        "[POST] /api/chat-history - Unauthorized: No authenticated user",
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(
      `[POST] /api/chat-history - Authenticated userId: ${authenticatedUserId}`,
    );

    // Parse and validate request body
    const body = await req.json();
    const validationResult = MessageSchema.safeParse(body);
    if (!validationResult.success) {
      console.log(
        "[POST] /api/chat-history - Invalid request body",
        validationResult.error,
      );
      return NextResponse.json(
        {
          error: "Invalid request body",
          details: validationResult.error.format(),
        },
        { status: 400 },
      );
    }
    const { userId, message, timestamp } = validationResult.data;
    console.log(
      "[POST] /api/chat-history - Request body validated successfully",
    );

    // Ensure the authenticated user can only add messages for their own userId
    if (userId !== authenticatedUserId) {
      console.log(
        `[POST] /api/chat-history - Unauthorized: userId mismatch. Auth: ${authenticatedUserId}, Requested: ${userId}`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Connect to MongoDB
    console.log("[POST] /api/chat-history - Connecting to MongoDB");
    const client = await clientPromise;
    const db = client.db("chatHistoryDB");
    console.log("[POST] /api/chat-history - Connected to MongoDB successfully");

    // Insert message into database
    console.log("[POST] /api/chat-history - Inserting message into database");
    const result = await db.collection("chats").insertOne({
      userId,
      message,
      timestamp: new Date(timestamp),
    });
    console.log(
      "[POST] /api/chat-history - Message inserted successfully",
      result,
    );

    // Return successful response
    console.log("[POST] /api/chat-history - Returning successful response");
    return NextResponse.json(
      { success: true, insertedId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("[POST] /api/chat-history - Error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.issues },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      // You might want to add more specific error handling here
      // For example, handling MongoDB specific errors
      return NextResponse.json(
        { error: "Internal server error", message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
