import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  defaultHeaders: {
    "X-Custom-Header": "value",
  },
  defaultQuery: {
    "api-version": "2023-05-15", // Example: specify API version
  },
  timeout: 30000, // Timeout in milliseconds (30 seconds in this example)
  maxRetries: 3, // Maximum number of retries for failed requests
});
