import fs from "fs";
const dbUrl =
  "postgresql://neondb_owner:npg_1NYwg2ZXduqI@ep-odd-voice-ah7pxcso-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require";
const content = `DATABASE_URL=${dbUrl}
DIRECT_URL=${dbUrl}
JWT_SECRET=your-secret-key-change-in-production
ENABLE_CACHE=false`;
fs.writeFileSync(".env", content);
const readBack = fs.readFileSync(".env", "utf8");
console.log("--- VERIFY START ---");
console.log(readBack);
console.log("--- VERIFY END ---");
if (readBack.includes("-pooler")) {
  console.log("SUCCESS: -pooler found");
} else {
  console.log("FAILURE: -pooler NOT found in file");
}
