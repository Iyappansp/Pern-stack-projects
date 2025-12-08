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

// Different rate limits for development vs production
const rateLimitConfig =
  process.env.NODE_ENV === "production"
    ? {
        // Production: More permissive limits for real users
        refillRate: 10, // Refill 10 tokens per interval
        interval: 60, // Every 60 seconds (1 minute)
        capacity: 100, // Max 100 requests before rate limit
      }
    : {
        // Development: Stricter for testing
        refillRate: 2,
        interval: 5,
        capacity: 3,
      };

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
      refillRate: rateLimitConfig.refillRate,
      interval: rateLimitConfig.interval,
      capacity: rateLimitConfig.capacity,
    }),
  ],
});
