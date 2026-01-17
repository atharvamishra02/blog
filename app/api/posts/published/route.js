import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma.js";
import { cache } from "../../../../lib/redis.js";

const CACHE_ENABLED = process.env.ENABLE_CACHE === "true";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const cacheKey = category
      ? `published:category:${category}:page:${page}:limit:${limit}`
      : `published:all:page:${page}:limit:${limit}`;

    // Try to get from cache if enabled
    if (CACHE_ENABLED) {
      try {
        const cached = await cache.get(cacheKey);
        if (cached) {
          console.log(`✅ Using cached posts for ${cacheKey}`);
          return NextResponse.json(cached);
        }
      } catch (cacheError) {
        console.warn("Cache read error:", cacheError.message);
      }
    }

    // Build query
    const where = {
      published: true,
    };

    if (category && category !== "all") {
      where.category = category.toLowerCase();
    }

    // Get total count for pagination
    const totalCount = await prisma.post.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    // Get from database with pagination
    const posts = await prisma.post.findMany({
      where,
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
      skip,
      take: limit,
    });

    const response = {
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      cached: false,
    };

    // Cache the result if enabled
    if (CACHE_ENABLED) {
      try {
        await cache.set(cacheKey, response, 900); // 15 mins
      } catch (cacheError) {
        console.warn("Cache write error:", cacheError.message);
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Get published posts error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch posts",
        details: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
