import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
const { PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT, DATABASE_URL } =
  process.env;

//ehtutha sql la connection pnanaum
// Use DATABASE_URL if available, otherwise construct from individual variables
let connectionString;
if (DATABASE_URL) {
  connectionString = DATABASE_URL;
} else {
  // Construct connection string - Neon typically doesn't need port
  const port = PGPORT ? `:${PGPORT}` : "";
  connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}${port}/${PGDATABASE}?sslmode=require`;
}

export const sql = neon(connectionString);

//#   psql 'postgresql://neondb_owner:npg_oBnYr1Ky9TQD@ep-frosty-water-a8n4hqdq-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require'
