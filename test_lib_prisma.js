import prisma from "./lib/prisma.js";

async function test() {
  try {
    console.log("Testing prisma connectivity from lib/prisma.js...");
    const count = await prisma.user.count();
    console.log("✅ Success! User count:", count);
  } catch (e) {
    console.error("❌ Failed:", e.message);
    if (e.message.includes("No database host")) {
      console.log(
        "HINT: DATABASE_URL is still missing in lib/prisma.js evaluation"
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

test();
