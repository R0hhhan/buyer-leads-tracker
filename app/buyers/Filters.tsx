"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function Filters() {
  const router = useRouter();
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("search") || "");
  const [city, setCity] = useState(params.get("city") || "");
  const [propertyType, setPropertyType] = useState(params.get("propertyType") || "");
  const [status, setStatus] = useState(params.get("status") || "");
  const [timeline, setTimeline] = useState(params.get("timeline") || "");

  // Memoize updateParams to prevent unnecessary re-renders
  const updateParams = useCallback((updates: Record<string, string>) => {
    const newParams = new URLSearchParams(params.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    newParams.set("page", "1"); // reset to page 1 on filter change
    const newUrl = `/buyers?${newParams.toString()}`;
    router.push(newUrl);
  }, [params, router]);

  // Debounced search - now with proper dependency array
  useEffect(() => {
    const handler = setTimeout(() => {
      updateParams({ search });
    }, 500);
    return () => clearTimeout(handler);
  }, [search, updateParams]);

  return (
    <div className="mb-6 bg-white p-4 rounded-lg border border-grey-200 shadow-sm">
      <div className="flex flex-wrap gap-3">
        <input
          className="border border-grey-300 p-2 rounded text-grey-700 placeholder-grey-400 focus:ring-2 focus:ring-grey-500 focus:border-transparent"
          placeholder="Search name/phone/email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          className="border border-grey-300 p-2 rounded text-grey-700 placeholder-grey-400 focus:ring-2 focus:ring-grey-500 focus:border-transparent"
          placeholder="City"
          value={city}
          onChange={(e) => {
            const value = e.target.value;
            setCity(value);
            updateParams({ city: value });
          }}
        />
        <input
          className="border border-grey-300 p-2 rounded text-grey-700 placeholder-grey-400 focus:ring-2 focus:ring-grey-500 focus:border-transparent"
          placeholder="Property Type"
          value={propertyType}
          onChange={(e) => {
            const value = e.target.value;
            setPropertyType(value);
            updateParams({ propertyType: value });
          }}
        />
        <input
          className="border border-grey-300 p-2 rounded text-grey-700 placeholder-grey-400 focus:ring-2 focus:ring-grey-500 focus:border-transparent"
          placeholder="Status"
          value={status}
          onChange={(e) => {
            const value = e.target.value;
            setStatus(value);
            updateParams({ status: value });
          }}
        />
        <input
          className="border border-grey-300 p-2 rounded text-grey-700 placeholder-grey-400 focus:ring-2 focus:ring-grey-500 focus:border-transparent"
          placeholder="Timeline"
          value={timeline}
          onChange={(e) => {
            const value = e.target.value;
            setTimeline(value);
            updateParams({ timeline: value });
          }}
        />
        
        {/* Clear filters button */}
        <button
          className="px-3 py-2 bg-grey-200 text-grey-700 rounded hover:bg-grey-300 transition-colors"
          onClick={() => {
            setSearch("");
            setCity("");
            setPropertyType("");
            setStatus("");
            setTimeline("");
            router.push("/buyers");
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}