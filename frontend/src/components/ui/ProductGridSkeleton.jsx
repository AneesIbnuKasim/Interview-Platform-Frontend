import { memo } from "react";

const ProductsGridSkeleton = memo(({length= 12}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-theme bg-card p-3 space-y-3"
        >
          {/* Image */}
          <div className="h-40 w-full rounded-lg bg-skeleton" />

          {/* Title */}
          <div className="h-4 w-3/4 rounded bg-skeleton" />

          {/* Price */}
          <div className="h-4 w-1/2 rounded bg-skeleton" />

          {/* Button */}
          <div className="h-9 w-full rounded-lg bg-skeleton" />
        </div>
      ))}
    </div>
  );
});

export default ProductsGridSkeleton;