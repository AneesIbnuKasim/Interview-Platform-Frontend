export default function ProductDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* LEFT – IMAGE */}
        <div className="space-y-4 bg-card p-5">
          <div className="aspect-square w-full rounded-xl bg-skeleton animate-pulse" />

          <div className="flex gap-3 bg-card p-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-lg bg-skeleton animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* RIGHT – DETAILS */}
        <div className="space-y-6 bg-card p-1">
          
          {/* Title */}
          <div className="h-7 w-3/4 rounded bg-skeleton animate-pulse" />
          <div className="h-5 w-1/2 rounded bg-skeleton animate-pulse" />

          {/* Rating */}
          <div className="flex items-center gap-2 bg-card p-1">
            <div className="h-4 w-24 rounded bg-skeleton animate-pulse" />
            <div className="h-4 w-16 rounded bg-skeleton animate-pulse" />
          </div>

          {/* Price */}
          <div className="space-y-2 bg-card p-1">
            <div className="h-7 w-32 rounded bg-skeleton animate-pulse" />
            <div className="h-4 w-24 rounded bg-skeleton animate-pulse" />
          </div>

          {/* Description */}
          <div className="space-y-2 bg-card p-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-4 w-full rounded bg-skeleton animate-pulse"
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2 bg-card p-1">
            <div className="h-12 w-40 rounded-lg bg-skeleton animate-pulse" />
            <div className="h-12 w-40 rounded-lg bg-skeleton animate-pulse" />
          </div>

          {/* Meta */}
          <div className="space-y-2 pt-4 bg-card p-1">
            <div className="h-4 w-48 rounded bg-skeleton animate-pulse" />
            <div className="h-4 w-56 rounded bg-skeleton animate-pulse" />
          </div>

        </div>
      </div>
    </div>
  );
}