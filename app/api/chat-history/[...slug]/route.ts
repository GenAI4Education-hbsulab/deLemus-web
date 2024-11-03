import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } },
) {
  console.log(
    `[GET] /api/chat-history/${params.slug.join("/")} - Request received`,
  );

  try {
    // Extract userId from the URL
    const userId = params.slug[0]!;
    const format = params.slug[1] || "json";

    // Validate userId parameter
    if (!userId) {
      console.log(
        `[GET] /api/chat-history/${params.slug.join(
          "/",
        )} - Bad Request: Missing userId parameter`,
      );
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 },
      );
    }

    // Authentication check
    // Disable for now to fetch all chat history
    /* const { userId: authenticatedUserId } = auth();
    if (!authenticatedUserId) {
      console.log(
        `[GET] /api/chat-history/${userId} - Unauthorized: No authenticated user`,
      );
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(
      `[GET] /api/chat-history/${userId} - Authenticated userId: ${authenticatedUserId}`,
    );

    // Ensure the authenticated user can only access their own chat history
    if (userId !== authenticatedUserId) {
      console.log(
        `[GET] /api/chat-history/${userId} - Forbidden: userId mismatch. Auth: ${authenticatedUserId}, Requested: ${userId}`,
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } */

    // Connect to MongoDB
    console.log(
      `[GET] /api/chat-history/${params.slug.join(
        "/",
      )} - Connecting to MongoDB`,
    );
    const client = await clientPromise;
    const db = client.db("chatHistoryDB");
    console.log(
      `[GET] /api/chat-history/${params.slug.join(
        "/",
      )} - Connected to MongoDB successfully`,
    );

    // Fetch chat history
    console.log(
      `[GET] /api/chat-history/${params.slug.join(
        "/",
      )}} - Fetching chat history`,
    );

    var searchUserId = undefined;
    if (userId != "all") {
      searchUserId = userId;
    }
    const chats = await db
      .collection("chats")
      .find({ userId: searchUserId })
      .sort({ timestamp: 1 })
      .toArray();
    console.log(
      `[GET] /api/chat-history/${params.slug.join(
        "/",
      )} - Fetched ${chats.length} chat messages`,
    );

    // Formattor
    var finalOutput = "";
    var finalOutputHeader = "";
    switch (format) {
      case "json":
        finalOutput = JSON.stringify(chats);
        finalOutputHeader = "application/json";
        break;
      case "csv":
        finalOutput = chats
          .map((chat) => {
            return `${chat.timestamp},${chat.message}`;
          })
          .join("\n");
        finalOutputHeader = "text/csv";
        break;
    }

    // Return successful response
    console.log(
      `[GET] /api/chat-history/${params.slug.join(
        "/",
      )} - Returning successful response`,
    );
    return new NextResponse(finalOutput, {
      status: 200,
      headers: { "Content-Type": finalOutputHeader },
    });
  } catch (error) {
    console.error(
      `[GET] /api/chat-history/${params.slug.join("/")} - Error:`,
      error,
    );

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
