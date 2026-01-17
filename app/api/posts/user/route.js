import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { cache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const cacheKey = `user:${userId}:posts`;

    // Try to get from cache
    try {
      const cached = await cache.get(cacheKey);

      if (cached) {
        console.log("✅ Posts from cache");
        return NextResponse.json({
          posts: cached,
          cached: true,
        });
      }
    } catch (cacheError) {
      console.error("Cache read error:", cacheError);
    }

    // Get from database
    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // Cache the result
    try {
      await cache.set(cacheKey, posts, 3600); // 1 hour TTL
      console.log("✅ Posts cached");
    } catch (cacheError) {
      console.error("Cache write error:", cacheError);
    }

    return NextResponse.json({
      posts,
      cached: false,
    });
  } catch (error) {
    console.error("Get user posts error:", error);

    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
