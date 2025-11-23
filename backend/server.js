// const express = require("express");
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./lib/arcjet.js";
// import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//apply archjet enga becoz ethutha motham backend oda starting point

app.use(async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // oru req oru token
    });
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
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
});
