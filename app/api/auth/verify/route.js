import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cache } from '../../../../lib/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CACHE_ENABLED = process.env.ENABLE_CACHE === 'true';

export async function GET(request) {
  try {
    // Try to get token from Authorization header first
    let token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    // If not in header, try to get from cookies
    if (!token) {
      token = request.cookies.get('token')?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Try to get user from cache first
    let user = null;
    if (CACHE_ENABLED) {
      user = await cache.get(`session:${decoded.userId}`);
    }

    // If not in cache, use decoded token data
    if (!user) {
      user = {
        userId: decoded.userId,
        email: decoded.email,
        name: decoded.name
      };
    }

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
