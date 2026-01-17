import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import dotenv from "dotenv";

dotenv.config();
neonConfig.webSocketConstructor = ws;

console.log(
  "DATABASE_URL:",
  process.env.DATABASE_URL ? "Defined" : "Undefined",
);
if (process.env.DATABASE_URL) {
  console.log("Length:", process.env.DATABASE_URL.length);
}

try {
  console.log("Attempting to create Pool...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  console.log("Pool created successfully!");

  console.log("Attempting a simple query...");
  const result = await pool.query("SELECT 1");
  console.log("Query success:", result.rows);

  await pool.end();
} catch (err) {
  console.error("❌ Pool Error:", err.message);
  console.error(err.stack);
}
