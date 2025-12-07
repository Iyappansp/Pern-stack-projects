import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";
import "dotenv/config";

// Set ARCJET_ENV to development if not set and we're in development
if (process.env.NODE_ENV !== "production" && !process.env.ARCJET_ENV) {
  process.env.ARCJET_ENV = "development";
}

// Determine mode based on environment
// DRY_RUN = allows requests but logs decisions (good for development)
// LIVE = actually blocks requests (for production)
const arcjetMode = process.env.NODE_ENV === "production" ? "LIVE" : "DRY_RUN";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  // In development, Arcjet will use 127.0.0.1 as fallback when IP is missing
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: arcjetMode }),

    detectBot({
      mode: arcjetMode,
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),

    tokenBucket({
      mode: arcjetMode,
      refillRate: 2, // Reduced from 5 to 2 tokens per interval
      interval: 10, // 10 seconds
      capacity: 3, // Reduced from 10 to 3 - now 3 requests max before rate limit
    }),
  ],
});
