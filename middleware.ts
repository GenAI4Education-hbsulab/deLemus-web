// middleware.js
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Example middleware logic
  const response = NextResponse.next();
  // Add headers or manipulate response as needed
  return response;
}

export const config = {
  matcher: "/api/:path*", // Adjust the matcher based on your routes
};
