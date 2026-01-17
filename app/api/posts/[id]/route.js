import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cache } from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    // Unwrap params for Next.js 15+
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Convert id to integer
    const postId = parseInt(id, 10);

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
    }

    const cacheKey = `post:${postId}`;

    // Try to get from cache with timeout
    try {
      const cached = await cache.get(cacheKey);

      if (cached) {
        console.log(`✅ Post ${postId} from cache`);
        return NextResponse.json({
          post: cached,
          cached: true,
        });
      }
    } catch (cacheError) {
      console.warn(
        "Cache read error (falling back to DB):",
        cacheError.message
      );
    }

    // Get from database
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
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

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Only return published posts or posts owned by the requester
    if (!post.published) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Cache the result with timeout
    try {
      // Cache for 1 hour (3600 seconds)
      await cache.set(cacheKey, post, 3600);

      console.log(`✅ Post ${postId} cached`);
    } catch (cacheError) {
      console.warn("Cache write error (non-blocking):", cacheError.message);
    }

    return NextResponse.json({
      post,
      cached: false,
    });
  } catch (error) {
    console.error("Get post error:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
