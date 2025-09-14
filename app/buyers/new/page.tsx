"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { buyerSchema } from "@/lib/validation";
import Link from "next/link";

// Define the form values type
type BuyerFormValues = z.infer<typeof buyerSchema>;

export default function SimplifiedBuyerForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BuyerFormValues>({
    resolver: zodResolver(buyerSchema) as any,
    defaultValues: {
      purpose: "Buy",
      timeline: "0-3m",
      source: "Website",
    },
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
        tags: typeof data.tags === 'string'
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch("/api/addBuyer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // This ensures cookies are sent with the request
        body: JSON.stringify(transformedData),
      });

    //   console.log(res);

      if(res.ok){
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
        }, 10000);
      }
      else{
        const err = await res.json();
        throw new Error(err.error || "Failed to create buyer");
      }
      
    //   reset();
    } catch (e: any) {
      setError(e.message || "Failed to save buyer lead");
    }
  };

  return (
    <div className="min-h-screen bg-grey-50 p-6">
      <div className="max-w-lg mx-auto">
        <Link href='/buyers' className="inline-flex items-center text-grey-600 hover:text-grey-800 mb-6 transition-colors">
          ← Back to list
        </Link>
        
        <div className="bg-white rounded-lg shadow-sm border border-grey-200 p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2 text-grey-900">New Buyer Lead</h1>
            <p className="text-grey-600 text-sm">
              Add a new property buyer to your database
            </p>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              ✅ Buyer lead saved successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-grey-700 border-b border-grey-200 pb-1">
                Contact Information
              </h3>

              <div>
                <input
                  {...register("fullName")}
                  placeholder="Full Name *"
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                />
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("phone")}
                  placeholder="Phone Number *"
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                />
                {errors.phone && (
                  <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <input
                  {...register("email")}
                  placeholder="Email (optional)"
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <select
                  {...register("city")}
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                >
                  <option value="">Select City *</option>
                  <option value="Chandigarh">Chandigarh</option>
                  <option value="Mohali">Mohali</option>
                  <option value="Zirakpur">Zirakpur</option>
                  <option value="Panchkula">Panchkula</option>
                  <option value="Other">Other</option>
                </select>
                {errors.city && (
                  <p className="text-red-600 text-xs mt-1">{errors.city.message}</p>
                )}
              </div>
            </div>

            {/* Property Requirements */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-grey-700 border-b border-grey-200 pb-1">
                Property Requirements
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    {...register("propertyType")}
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                  >
                    <option value="">Property Type *</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Office">Office</option>
                    <option value="Retail">Retail</option>
                  </select>
                  {errors.propertyType && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.propertyType.message}
                    </p>
                  )}
                </div>

                <div>
                  <select
                    {...register("purpose")}
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                  >
                    <option value="Buy">Buy</option>
                    <option value="Rent">Rent</option>
                  </select>
                </div>
              </div>

              {showBHK && (
                <div>
                  <select
                    {...register("bhk")}
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                  >
                    <option value="">BHK Configuration *</option>
                    <option value="Studio">Studio</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                  </select>
                  {errors.bhk && (
                    <p className="text-red-600 text-xs mt-1">{errors.bhk.message}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register("budgetMin")}
                    type="number"
                    placeholder="Min Budget (₹)"
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                  />
                </div>
                <div>
                  <input
                    {...register("budgetMax")}
                    type="number"
                    placeholder="Max Budget (₹)"
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                  />
                  {errors.budgetMax && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.budgetMax.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-grey-700 border-b border-grey-200 pb-1">
                Additional Details
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    {...register("timeline")}
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                  >
                    <option value="0-3m">0-3 months</option>
                    <option value="3-6m">3-6 months</option>
                    <option value=">6m">6+ months</option>
                    <option value="Exploring">Just exploring</option>
                  </select>
                </div>

                <div>
                  <select
                    {...register("source")}
                    className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900"
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Call">Phone Call</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <input
                  {...register("tags")}
                  placeholder="Tags (comma-separated)"
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent text-grey-900 placeholder-grey-400"
                />
              </div>

              <div>
                <textarea
                  {...register("notes")}
                  placeholder="Notes or additional requirements"
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-grey-300 rounded-lg focus:ring-2 focus:ring-grey-500 focus:border-transparent resize-none text-grey-900 placeholder-grey-400"
                />
                {errors.notes && (
                  <p className="text-red-600 text-xs mt-1">{errors.notes.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-grey-600 hover:bg-grey-700 disabled:bg-grey-400 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {isSubmitting ? "Saving Lead..." : "Save Buyer Lead"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
