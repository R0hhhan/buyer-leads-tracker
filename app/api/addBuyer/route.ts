import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerSchema } from "@/lib/validation";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

async function getUserIdFromRequest(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      role: string;
    };
    return decoded.userId;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = buyerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const userId = await getUserIdFromRequest();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - No valid token provided" },
        { status: 401 }
      );
    }

    // Create buyer linked to logged-in user
    const buyer = await prisma.buyer.create({
      data: {
        ...parsed.data,
        ownerId: userId,
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      },
    });

    await prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: userId,
        diff: { created: parsed.data, timestamp: new Date().toISOString() },
      },
    });

    return NextResponse.json({
      success: true,
      data: buyer,
      message: "Buyer created successfully",
    });
  } catch (error) {
    console.error("Error creating buyer:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create buyer" },
      { status: 500 }
    );
  }
}
