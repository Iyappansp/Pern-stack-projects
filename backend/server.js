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
const PORT = process.env.PORT || 3001;

// Configure CORS properly - MUST be before other middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite dev server
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//apply archjet enga becoz ethutha motham backend oda starting point
// Skip Arcjet protection for OPTIONS requests (CORS preflight)
app.use(async (req, res, next) => {
  // Allow OPTIONS requests (CORS preflight) to pass through without Arcjet protection
  if (req.method === "OPTIONS") {
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

if (process.env.NODE_ENV === "production") {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

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
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
