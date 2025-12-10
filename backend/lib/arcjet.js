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
        // Production: 30 requests max, then refill every 10 seconds
        refillRate: 10,    // Refill 10 tokens per interval
        interval: 10,      // Every 10 seconds (as requested)
        capacity: 30,      // Max 30 requests before rate limit (as requested)
      }
    : {
        // Development: More lenient to avoid blocking during development
        refillRate: 10,  // Changed from 2
        interval: 5,
        capacity: 20,     // Changed from 3
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
