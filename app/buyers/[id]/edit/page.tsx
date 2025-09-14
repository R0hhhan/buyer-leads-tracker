// app/buyers/[id]/edit/page.tsx
import EditBuyerForm from "./EditBuyerForm";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

interface PageProps {
  params: { id: string }; 
}

export default async function BuyerEditPage({ params }: PageProps) {  
  // Await params before destructuring
  const { id } = await params;

  // ✅ 1. Read JWT from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login"); // not logged in
  }

  // ✅ 2. Verify token
  let decoded: { userId: string; role: string; username: string };
  try {
    decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      username: string;
    };
  } catch (err) {
    console.error("Invalid token:", err);
    redirect("/login");
  }

  // ✅ 3. Fetch buyer first to check ownership
  const buyer = await prisma.buyer.findUnique({
    where: { id },
  });

  if (!buyer) {
    return <p className="p-6 text-grey-600">Buyer not found</p>;
  }

  // ✅ 4. Enforce role and ownership
  // Convert both IDs to string for consistent comparison
  const currentUserId = String(decoded.userId);
  const buyerOwnerId = String(buyer.ownerId);

  if (decoded.role !== "admin" && currentUserId !== buyerOwnerId) {
    console.log('Current user ID:', currentUserId);
    console.log('Buyer owner ID:', buyerOwnerId);
    return <p className="p-6 text-grey-600">❌ Unauthorized - You can only edit your own records</p>;
  }

  return <EditBuyerForm buyer={buyer} />;
}
