// app/buyers/[id]/edit/page.tsx
import EditBuyerForm from "./EditBuyerForm";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect, notFound } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

interface PageProps {
  params: { id: string };
}

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: string;
      username: string;
    };
  } catch {
    return null;
  }
}

export default async function BuyerEditPage({ params }: PageProps) {
  const { id } = params;

  // 1. Check JWT
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/login");

  const decoded = verifyToken(token!);
  if (!decoded) redirect("/login");

  // 2. Fetch buyer
  const buyer = await prisma.buyer.findUnique({
    where: { id },
  });
  if (!buyer) notFound();

  // 3. Ownership / role check
  if (decoded.role !== "admin" && decoded.userId !== String(buyer.ownerId)) {
    return (
      <p className="p-6 text-gray-600">
        ❌ Unauthorized – You can only edit your own records
      </p>
    );
  }

  // 4. Render form
  return <EditBuyerForm buyer={buyer} />;
}
