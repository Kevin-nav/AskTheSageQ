"use client"

import { StatCardSkeleton } from "@/components/loading-states";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="h-8 w-1/3 bg-slate-200 rounded-md animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-md animate-pulse" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Actions bar skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 h-10 bg-slate-200 rounded-md animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-10 w-24 bg-slate-200 rounded-md animate-pulse" />
        </div>
      </div>

      {/* Table skeleton */}
      <div className="bg-white/80 rounded-lg shadow-md p-6">
        <div className="h-6 w-1/4 bg-slate-200 rounded-md animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-md animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}