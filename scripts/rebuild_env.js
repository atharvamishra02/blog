import fs from "fs";
const content = `DATABASE_URL=postgresql://neondb_owner:npg_1NYwg2ZXduqI@ep-odd-voice-ah7pxcso-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
DIRECT_URL=postgresql://neondb_owner:npg_1NYwg2ZXduqI@ep-odd-voice-ah7pxcso.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-secret-key-change-in-production
ENABLE_CACHE=false
`;
fs.writeFileSync(".env", content);
console.log("Fixed .env corruption and restored pooled URL");
