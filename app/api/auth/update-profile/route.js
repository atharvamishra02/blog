import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '../../../../lib/prisma.js';
import { cache } from '../../../../lib/redis.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const CACHE_ENABLED = process.env.ENABLE_CACHE === 'true';

export async function PUT(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { name, username } = await request.json();

    // Validation
    if (!name || !username) {
      return NextResponse.json(
        { error: 'Name and username are required' },
        { status: 400 }
      );
    }

    // Check if username already exists for another user
    if (username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: username,
          NOT: {
            id: decoded.userId
          }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name,
        username
      }
    });

    // Invalidate cache
    if (CACHE_ENABLED) {
      await cache.del(`user:email:${updatedUser.email}`);
      await cache.del(`session:${updatedUser.id}`);
      // Update session cache with new data
      await cache.set(`session:${updatedUser.id}`, {
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        username: updatedUser.username
      }, 604800);
    }

    // Return updated user without password
    const { password, ...userWithoutPassword } = updatedUser;

    // Create new JWT with updated info
    const newToken = jwt.sign(
      { userId: updatedUser.id, email: updatedUser.email, name: updatedUser.name, username: updatedUser.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: userWithoutPassword,
        token: newToken
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
