// app/api/buyers/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buyerSchema } from "@/lib/validation";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify JWT token
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    let decoded: { userId: string; role: string; username: string };
    try {
      decoded = jwt.verify(token, JWT_SECRET) as {
        userId: string;
        role: string;
        username: string;
      };
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = buyerSchema.safeParse(body);

    if (!parsed.success) {
      console.error("Validation error:", parsed.error);
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    // Fetch existing buyer
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id: params.id },
    });

    if (!existingBuyer) {
      return NextResponse.json(
        { success: false, error: "Buyer not found" },
        { status: 404 }
      );
    }

    // Only allow admin or owner to update
    if (decoded.role !== "admin" && existingBuyer.ownerId !== decoded.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Compute diff for history
    const diff: Record<string, { old: any; new: any }> = {};
    Object.keys(parsed.data).forEach((key) => {
      if ((existingBuyer as any)[key] !== (parsed.data as any)[key]) {
        diff[key] = { old: (existingBuyer as any)[key], new: (parsed.data as any)[key] };
      }
    });

    // Update buyer
    const updatedBuyer = await prisma.buyer.update({
      where: { id: params.id },
      data: {
        ...parsed.data,
        tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      },
    });

    // Add history entry
    if (Object.keys(diff).length > 0) {
      await prisma.buyerHistory.create({
        data: {
          buyerId: params.id,
          changedBy: decoded.userId,
          diff: {
            ...diff,
            timestamp: new Date().toISOString(),
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedBuyer,
      message: "Buyer updated successfully",
    });
  } catch (error) {
    console.error("Error updating buyer:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update buyer",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
