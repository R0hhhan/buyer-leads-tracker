import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function BuyerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const buyer = await prisma.buyer.findUnique({
    where: { id: params.id },
  });

  if (!buyer) {
    notFound();
  }

  return (
    <div className="p-6 bg-grey-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/buyers" 
          className="inline-flex items-center text-grey-600 hover:text-grey-800 mb-6 transition-colors"
        >
          ← Back to list
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-grey-200 p-6">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl font-bold text-grey-900">{buyer.fullName}</h1>
            <Link
              href={`/buyers/${buyer.id}/edit`}
              className="px-4 py-2 bg-grey-600 text-white rounded hover:bg-grey-700 transition-colors"
            >
              Edit
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-grey-500">Phone</label>
                <p className="text-grey-900">{buyer.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">Email</label>
                <p className="text-grey-900">{buyer.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">City</label>
                <p className="text-grey-900">{buyer.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">Property Type</label>
                <p className="text-grey-900">{buyer.propertyType}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-grey-500">Budget</label>
                <p className="text-grey-900">₹{buyer.budgetMin} – ₹{buyer.budgetMax}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">Timeline</label>
                <p className="text-grey-900">{buyer.timeline}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">Status</label>
                <p className="text-grey-900">{buyer.status}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-grey-500">Last Updated</label>
                <p className="text-grey-600 text-sm">{new Date(buyer.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
