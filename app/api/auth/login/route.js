import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../../../lib/prisma.js";
import { cache } from "../../../../lib/redis.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";
const CACHE_ENABLED = process.env.ENABLE_CACHE === "true";

export async function POST(request) {
  try {
    const { email, password: loginPassword } = await request.json();

    // Validation
    if (!email || !loginPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in database
    let user;
    try {
      // Try to get user from cache first
      const cacheKey = `user:email:${email}`;
      if (CACHE_ENABLED) {
        user = await cache.get(cacheKey);
      }

      // If not in cache, get from database
      if (!user) {
        user = await prisma.user.findUnique({
          where: { email },
        });

        // Cache user data for 1 hour
        if (user && CACHE_ENABLED) {
          await cache.set(cacheKey, user, 3600);
        }
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json(
        {
          error:
            "Database connection failed. Please check your network and .env configuration.",
          details: dbError.message,
          code: dbError.code,
        },
        { status: 503 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginPassword, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
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
        message: "Login successful",
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
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}
