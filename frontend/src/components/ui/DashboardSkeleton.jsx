import React from "react";
import { TableSkeleton } from "./TableSkeleton";

// ---------------- DASHBOARD SKELETON ----------------

export const DashboardSkeleton = () => {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="h-6 w-48 bg-gray-200 rounded" />
        <div className="h-9 w-32 bg-gray-200 rounded-lg" />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-300 rounded-xl p-4 space-y-3"
          >
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-7 w-32 bg-gray-300 rounded" />
            <div className="h-3 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="bg-white border border-gray-300 rounded-xl p-4 space-y-4">
        <div className="h-5 w-40 bg-gray-200 rounded" />
        <div className="h-64 w-full bg-gray-100 rounded-lg" />
      </div>

      {/* Table Skeleton */}
      <TableSkeleton rows={6} cols={5} />
    </div>
  );
};

