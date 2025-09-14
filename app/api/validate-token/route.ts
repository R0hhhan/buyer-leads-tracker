// app/api/validate-token/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ valid: true, user: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
