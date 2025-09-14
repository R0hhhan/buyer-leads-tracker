import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get("search") || "";
    const city = searchParams.get("city") || "";
    const propertyType = searchParams.get("propertyType") || "";
    const status = searchParams.get("status") || "";
    const timeline = searchParams.get("timeline") || "";

    // Build the where clause (same logic as in the main page)
    const where: Record<string, unknown> = {
      ...(city && { city }),
      ...(propertyType && { propertyType }),
      ...(status && { status }),
      ...(timeline && { timeline }),
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    // Fetch ALL buyers matching the filters (no pagination)
    const buyers = await prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        city: true,
        propertyType: true,
        budgetMin: true,
        budgetMax: true,
        timeline: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        // Add any other fields you want to export
      },
    });

    // Convert to CSV
    const csvContent = convertToCSV(buyers);

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="buyers_export.csv"',
      },
    });

  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

function convertToCSV(buyers: Array<{
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  propertyType: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  timeline: string | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}>): string {
  if (buyers.length === 0) {
    return 'No data to export';
  }

  // Define the headers
  const headers = [
    'ID',
    'Full Name',
    'Phone',
    'Email',
    'City',
    'Property Type',
    'Budget Min',
    'Budget Max',
    'Timeline',
    'Status',
    'Created At',
    'Updated At'
  ];

  // Create CSV content
  const csvRows = [
    headers.join(','), // Header row
    ...buyers.map(buyer => [
      buyer.id,
      `"${buyer.fullName || ''}"`, // Wrap in quotes to handle commas in names
      `"${buyer.phone || ''}"`,
      `"${buyer.email || ''}"`,
      `"${buyer.city || ''}"`,
      `"${buyer.propertyType || ''}"`,
      buyer.budgetMin || '',
      buyer.budgetMax || '',
      `"${buyer.timeline || ''}"`,
      `"${buyer.status || ''}"`,
      buyer.createdAt ? new Date(buyer.createdAt).toLocaleString() : '',
      buyer.updatedAt ? new Date(buyer.updatedAt).toLocaleString() : ''
    ].join(','))
  ];

  return csvRows.join('\n');
}