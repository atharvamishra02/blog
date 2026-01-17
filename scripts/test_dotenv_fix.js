import fs from "fs";
import dotenv from "dotenv";

const dbUrl =
  "postgresql://neondb_owner:npg_1NYwg2ZXduqI@ep-odd-voice-ah7pxcso-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const content = `DATABASE_URL=${dbUrl}\nDIRECT_URL=${dbUrl}\nJWT_SECRET=your-secret-key-change-in-production\nENABLE_CACHE=false\n`;

console.log("Writing clean .env...");
fs.writeFileSync(".env", content, "utf8");

console.log("Attempting to load with dotenv...");
const result = dotenv.config();
if (result.error) {
  console.error("dotenv error:", result.error);
} else {
  console.log("dotenv parsed keys:", Object.keys(result.parsed));
  console.log(
    "DATABASE_URL length:",
    process.env.DATABASE_URL ? process.env.DATABASE_URL.length : "MISSING"
  );
}
