import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma.js";
import jwt from "jsonwebtoken";
import { cache } from "../../../../lib/redis.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const CACHE_ENABLED = process.env.ENABLE_CACHE === "true";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.log("Post Create: No token found");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.log("Post Create: Token verification failed", err.message);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = decoded.userId;
    console.log("Post Create: User ID from token:", userId);

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.log("Post Create: Failed to parse request body");
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { title, content, category } = body;

    // Validate input
    if (!title || !content || !category) {
      console.log("Post Create: Missing required fields", {
        title: !!title,
        content: !!content,
        category: !!category,
      });
      return NextResponse.json(
        { error: "Title, content, and category are required" },
        { status: 400 }
      );
    }

    // Check if user exists to avoid foreign key errors
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      console.log("Post Create: User not found in database", userId);
      return NextResponse.json(
        { error: "User session is invalid. Please log in again." },
        { status: 401 }
      );
    }

    // Create post in database
    console.log("Post Create: Attempting to create post for user", user.id);
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content,
        category: category.toLowerCase(),
        authorId: user.id,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
          },
        },
      },
    });

    console.log("Post Create: Post created successfully", post.id);

    // Invalidate cache if enabled
    if (CACHE_ENABLED) {
      try {
        await cache.del(`user:${userId}:posts`);
        await cache.delPattern(
          `published:category:${category.toLowerCase()}:*`
        );
        await cache.delPattern("published:all:*");
        await cache.del(`category:${category.toLowerCase()}:posts`);
        await cache.del("posts:all");
        await cache.del("posts:recent");
      } catch (cacheError) {
        console.warn(
          "Post Create: Cache invalidation error (non-fatal):",
          cacheError.message
        );
      }
    }

    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Post Create: CRITICAL ERROR:", error);

    return NextResponse.json(
      {
        error: `Failed to create post: ${error.message}`,
        details: error.message,
        code: error.code,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
