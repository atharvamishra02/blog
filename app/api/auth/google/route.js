import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma.js";
import { cache } from "../../../../lib/redis.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const CACHE_ENABLED = process.env.ENABLE_CACHE === "true";

export async function POST(request) {
  try {
    const { email, name, picture, googleId } = await request.json();

    // Validation
    if (!email || !googleId) {
      return NextResponse.json(
        { error: "Email and Google ID are required" },
        { status: 400 }
      );
    }

    let user;
    try {
      // Check if user exists
      user = await prisma.user.findUnique({
        where: { email },
      });

      // If user doesn't exist, create new user
      if (!user) {
        user = await prisma.user.create({
          data: {
            email,
            name: name || email.split("@")[0],
            password: "", // No password for Google OAuth users
            googleId,
            picture,
          },
        });
      } else {
        // Update user with Google info if not already set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { email },
            data: {
              googleId,
              picture: picture || user.picture,
            },
          });
        }
      }

      // Cache user data
      if (CACHE_ENABLED) {
        const cacheKey = `user:email:${email}`;
        await cache.set(cacheKey, user, 3600);
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error:
            "Database not configured. Please set up PostgreSQL and run: npx prisma migrate dev",
          details: "Check DATABASE_SETUP.md for instructions",
        },
        { status: 503 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cache the session
    if (CACHE_ENABLED) {
      await cache.set(
        `session:${user.id}`,
        { userId: user.id, email: user.email, name: user.name },
        604800
      ); // 7 days
    }

    // Return user data without password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    // Create response with cookie
    const response = NextResponse.json(
      {
        message: "Google login successful",
        user: userWithoutPassword,
        token,
      },
      { status: 200 }
    );

    // Set token as HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
