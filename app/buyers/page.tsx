import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Filters from "./Filters";
import ExportButton from "./ExportButton";

const PAGE_SIZE = 10;

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const page = parseInt((params.page as string) || "1", 10);
  const search = (params.search as string) || "";
  const city = (params.city as string) || "";
  const propertyType = (params.propertyType as string) || "";
  const status = (params.status as string) || "";
  const timeline = (params.timeline as string) || "";

  const where: Record<string, unknown> = {
    ...(city && { city: { contains: city, mode: "insensitive" } }),
    ...(propertyType && { propertyType: { contains: propertyType, mode: "insensitive" } }),
    ...(status && { status: { contains: status, mode: "insensitive" } }),
    ...(timeline && { timeline: { contains: timeline, mode: "insensitive" } }),
    ...(search && {
      OR: [
        { fullName: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { email: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  // Debug logging

  const [buyers, total] = await Promise.all([
    prisma.buyer.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.buyer.count({ where }),
  ]);

  if (page < 1 || (page > 1 && buyers.length === 0)) {
    notFound();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-6 bg-grey-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-grey-900">Buyers</h1>
        <div className="flex items-center gap-10">
          <Link href="/buyers/new" className="px-3 py-1 border border-grey-300 rounded bg-white text-grey-700 hover:bg-grey-50 transition-colors">
            Add New Buyer
          </Link>
          <ExportButton filters={{ city, propertyType, status, timeline, search }} />
        </div>
      </div>
      
      <Filters />

      <div className="bg-white rounded-lg shadow-sm border border-grey-200 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-grey-100">
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Name</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Phone</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">City</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Property Type</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Budget</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Timeline</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Status</th>
              <th className="border-b border-grey-200 p-3 text-left text-grey-700 font-medium">Updated</th>
              <th className="border-b border-grey-200 p-3 text-center text-grey-700 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map((b) => (
              <tr key={b.id} className="hover:bg-grey-50 transition-colors">
                <td className="border-b border-grey-100 p-3 text-grey-900">{b.fullName}</td>
                <td className="border-b border-grey-100 p-3 text-grey-700">{b.phone}</td>
                <td className="border-b border-grey-100 p-3 text-grey-700">{b.city}</td>
                <td className="border-b border-grey-100 p-3 text-grey-700">{b.propertyType}</td>
                <td className="border-b border-grey-100 p-3 text-grey-700">
                  {b.budgetMin} – {b.budgetMax}
                </td>
                <td className="border-b border-grey-100 p-3 text-grey-700">{b.timeline}</td>
                <td className="border-b border-grey-100 p-3 text-grey-700">{b.status}</td>
                <td className="border-b border-grey-100 p-3 text-grey-600 text-sm">
                  {new Date(b.updatedAt).toLocaleString()}
                </td>
                <td className="border-b border-grey-100 p-3 text-center">
                  <Link
                    href={`/buyers/${b.id}`}
                    className="text-grey-600 hover:text-grey-800 hover:underline mr-3 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/buyers/${b.id}/edit`}
                    className="text-grey-600 hover:text-grey-800 hover:underline transition-colors"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {buyers.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center p-8 text-grey-500">
                  No buyers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-grey-600">
          Page {page} of {totalPages}
        </p>
        <div className="space-x-2">
          {page > 1 && (
            <Link
              href={{ query: { ...searchParams, page: page - 1 } }}
              className="px-3 py-1 border border-grey-300 rounded bg-white text-grey-700 hover:bg-grey-50 transition-colors"
            >
              Previous
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={{ query: { ...params, page: page + 1 } }}
              className="px-3 py-1 border border-grey-300 rounded bg-white text-grey-700 hover:bg-grey-50 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}