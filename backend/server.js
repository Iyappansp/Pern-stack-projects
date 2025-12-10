// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
// import dotenv from "dotenv";
dotenv.config();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS properly - MUST be before other middleware
// Allow multiple origins for development and production
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [
      "http://localhost:5173", // Development frontend
      "https://pern-stack-projects.onrender.com", // Your production frontend
    ];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, be more permissive
        if (process.env.NODE_ENV !== "production") {
          callback(null, true);
        } else {
          // Reject the request without throwing an error
          callback(null, false);
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app in production BEFORE Arcjet
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
}

// Health check endpoint (before Arcjet for easy testing)
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Backend is running",
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

//apply archjet enga becoz ethutha motham backend oda starting point
// Skip Arcjet protection for OPTIONS requests (CORS preflight) and static assets
app.use(async (req, res, next) => {
  // Allow OPTIONS requests (CORS preflight) to pass through without Arcjet protection
  if (req.method === "OPTIONS") {
    return next();
  }

  // Skip Arcjet for health check endpoint (already handled above, but keep for safety)
  if (req.path === "/api/health") {
    return next();
  }

  // Skip Arcjet for static assets (CSS, JS, images, fonts, etc.)
  // This prevents CSS files from being blocked and served as JSON
  if (
    req.path.startsWith("/assets/") ||
    req.path.startsWith("/static/") ||
    req.path.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  ) {
    return next();
  }

  try {
    const decision = await aj.protect(req, {
      requested: 1, // oru req oru token
    });

    // Add logging to see what Arcjet is doing (only in development)
    if (process.env.NODE_ENV !== "production") {
      try {
        console.log("Arcjet Decision:", {
          isDenied: decision.isDenied(),
          reason: decision.reason?.toString() || "N/A",
          results:
            decision.results?.map((r) => ({
              state: r.state,
              conclusion: r.conclusion,
            })) || [],
        });
      } catch (logError) {
        console.log("Arcjet Decision (simplified):", {
          isDenied: decision.isDenied(),
        });
      }
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({
          error: "Too many requests, please try again later",
        });
      } else if (decision.reason.isBot()) {
        return res.status(403).json({
          error: "Forbidden: Bot detected",
        });
      } else {
        return res.status(403).json({
          error: "Forbidden: Unknown reason",
        });
      }
    }

    //spoof bot means antha bot namala yemathirum
    next();
  } catch (error) {
    console.error("Archjet protection error", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.use("/api/products", productRoutes);

// 404 handler for API routes (must be before production catch-all)
// Express 5 doesn't support /api/* pattern, so we use a middleware function
app.use((req, res, next) => {
  // Only handle API routes that haven't been matched
  if (req.path.startsWith("/api") && !req.route) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.path}`,
    });
  }
  // Pass to next middleware for non-API routes
  next();
});

if (process.env.NODE_ENV === "production") {
  // Catch-all handler: send back React's index.html file for all non-API routes
  // This must be after all API routes
  app.use((req, res, next) => {
    // Skip if it's an API route
    if (req.path.startsWith("/api")) {
      return next();
    }
    // For all other routes, send the React app
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

async function initDB() {
  try {
    await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            image VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ); `;
    // console.log("Table created successfully");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}
initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access it at http://localhost:${PORT}`);
  });
});
