import dotenv from "dotenv";
dotenv.config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("DIRECT_URL:", process.env.DIRECT_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("ENABLE_CACHE:", process.env.ENABLE_CACHE);
