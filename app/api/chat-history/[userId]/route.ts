import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  console.log(`[GET] /api/chat-history/${params.userId} - Request received`);

  try {
    // Authentication check
    const { userId: authenticatedUserId } = auth();
    if (!authenticatedUserId) {
      console.log(
        `[GET] /api/chat-history/${params.userId} - Unauthorized: No authenticated user`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(
      `[GET] /api/chat-history/${params.userId} - Authenticated userId: ${authenticatedUserId}`,
    );

    // Validate userId parameter
    const { userId } = params;
    if (!userId) {
      console.log(
        `[GET] /api/chat-history/${params.userId} - Bad Request: Missing userId parameter`,
      );
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Ensure the authenticated user can only access their own chat history
    if (userId !== authenticatedUserId) {
      console.log(
        `[GET] /api/chat-history/${params.userId} - Forbidden: userId mismatch. Auth: ${authenticatedUserId}, Requested: ${userId}`,
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Connect to MongoDB
    console.log(
      `[GET] /api/chat-history/${params.userId} - Connecting to MongoDB`,
    );
    const client = await clientPromise;
    const db = client.db("chatHistoryDB");
    console.log(
      `[GET] /api/chat-history/${params.userId} - Connected to MongoDB successfully`,
    );

    // Fetch chat history
    console.log(
      `[GET] /api/chat-history/${params.userId} - Fetching chat history`,
    );
    const chats = await db
      .collection("chats")
      .find({ userId })
      .sort({ timestamp: 1 })
      .toArray();
    console.log(
      `[GET] /api/chat-history/${params.userId} - Fetched ${chats.length} chat messages`,
    );

    // Return successful response
    console.log(
      `[GET] /api/chat-history/${params.userId} - Returning successful response`,
    );
    return NextResponse.json(chats, { status: 200 });
  } catch (error) {
    console.error(`[GET] /api/chat-history/${params.userId} - Error:`, error);

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
