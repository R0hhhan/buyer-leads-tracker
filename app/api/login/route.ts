import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET!; // require it to be set

export async function POST(req: Request) {
  try {
    const { action, username, password, email, name } = await req.json();

    if (!action || (action !== "login" && action !== "signup")) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (action === "signup") {
      if (!username || !password || !email || !name) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Username or email already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username, 
          password: hashedPassword,
          email,
          name,
        },
      });

      const token = jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const res = NextResponse.json({ success: true });

  // Set token in cookie
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return res;
    }

    // ---- Login logic ----
    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    // Set token in cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
