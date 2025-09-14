// components/EditBuyerForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { buyerSchema } from "@/lib/validation";

type BuyerFormValues = z.infer<typeof buyerSchema>;


export default function EditBuyerForm({ buyer }: any) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = 
    useForm<BuyerFormValues>({
      resolver: zodResolver(buyerSchema) as any,
      defaultValues: buyer,
    });

  const propertyType = watch("propertyType");
  const showBHK = propertyType === "Apartment" || propertyType === "Villa";

  const onSubmit = async (data: BuyerFormValues) => {
    setError(null);
    setSuccess(false);

    try {
      const transformedData = {
        ...data,
        email: data.email || undefined,
        tags: typeof data.tags === "string"
          ? data.tags.split(",").map(t => t.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch(`/api/buyers/${buyer.id}/edit`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transformedData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to update buyer");
      }
    } catch (e: any) {
      setError(e.message || "Failed to update buyer");
    }
  };

  return (
    <div className="min-h-screen bg-grey-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link 
          href={`/buyers/${buyer.id}`} 
          className="inline-flex items-center text-grey-600 hover:text-grey-800 mb-6 transition-colors"
        >
          ← Back to view
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-grey-200 p-6">
          <h1 className="text-2xl font-bold mb-4 text-grey-900">Edit Buyer Lead</h1>

          {success && <p className="text-green-600 mb-4">✅ Updated successfully!</p>}
          {error && <p className="text-red-600 mb-4">❌ {error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div>
              <input
                {...register("fullName")}
                placeholder="Full Name *"
                className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
              />
              {errors.fullName && <p className="text-red-600 text-xs">{errors.fullName.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <input
                {...register("phone")}
                placeholder="Phone *"
                className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
              />
              {errors.phone && <p className="text-red-600 text-xs">{errors.phone.message}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                {...register("email")}
                placeholder="Email"
                className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
              />
              {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
            </div>

            {/* City */}
            <div>
              <select {...register("city")} className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900">
                <option value="">Select City</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Mohali">Mohali</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Panchkula">Panchkula</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <select {...register("propertyType")} className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900">
                <option value="">Property Type</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
              </select>
            </div>

            {/* Conditional BHK */}
            {showBHK && (
              <div>
                <select {...register("bhk")} className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900">
                  <option value="">BHK</option>
                  <option value="Studio">Studio</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                </select>
              </div>
            )}

            {/* Budget */}
            <div className="grid grid-cols-2 gap-2">
              <input {...register("budgetMin")} type="number" placeholder="Min Budget" className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"/>
              <input {...register("budgetMax")} type="number" placeholder="Max Budget" className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"/>
            </div>

            {/* Timeline */}
            <div>
              <select {...register("timeline")} className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900">
                <option value="0-3m">0-3 months</option>
                <option value="3-6m">3-6 months</option>
                <option value=">6m">6+ months</option>
                <option value="Exploring">Just exploring</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <textarea {...register("notes")} placeholder="Notes" className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"/>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-grey-600 hover:bg-grey-700 disabled:bg-grey-400 text-white py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Updating..." : "Update Buyer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}