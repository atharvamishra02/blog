import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import getRedisClient from '@/lib/redis';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    // Unwrap params for Next.js 15+
    const resolvedParams = await params;
    const { category } = resolvedParams;
    const cacheKey = `category:${category}:posts`;

    // Try to get from cache
    try {
      const redis = await getRedisClient();
      const cached = await redis.get(cacheKey);
      
      if (cached) {
        console.log(`✅ ${category} posts from cache`);
        return NextResponse.json({
          posts: JSON.parse(cached),
          cached: true
        });
      }
    } catch (cacheError) {
      console.error('Cache read error:', cacheError);
    }

    // Get from database
    const posts = await prisma.post.findMany({
      where: {
        category: category.toLowerCase(),
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Cache the result
    try {
      const redis = await getRedisClient();
      await redis.setex(cacheKey, 1800, JSON.stringify(posts)); // 30 minutes TTL
      console.log(`✅ ${category} posts cached`);
    } catch (cacheError) {
      console.error('Cache write error:', cacheError);
    }

    return NextResponse.json({
      posts,
      category,
      cached: false
    });

  } catch (error) {
    console.error('Get category posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
