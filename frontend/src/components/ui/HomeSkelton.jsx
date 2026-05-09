import Skeleton from "./Skeleton";

const HomeSkeleton = () => {
  return (
    <main className="bg-slate-50 min-h-screen">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-40 mb-6" />
        <div className="flex gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="w-14 h-4" />
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCT SLIDER */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-6 w-32 mb-6" />
        <div className="flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-[240px] h-[320px]" />
          ))}
        </div>
      </section>

      {/* OFFER */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[260px]" />
        <Skeleton className="h-[260px]" />
      </section>
    </main>
  );
};

export default HomeSkeleton;