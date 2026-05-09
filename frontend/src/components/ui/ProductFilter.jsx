import React from "react";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import CategoryFilter from "./CategoryFilter";
import SortFilter from "./SortFilter";

function ProductFilter({ resetAll, filters, setFilters, allCategories }) {
  return (
    <aside className="w-full p-5 shadow-md bg-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-[18px]">FILTERS</h3>
        <button
          className="text-sm text-purple-600 font-medium hover:underline"
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>
      <SortFilter setFilters={setFilters} filters={filters} />
      <PriceFilter
        filters={filters}
        setFilters={setFilters}
        applyPrice={() => console.log("price applied")}
      />
      {/* <Rating /> */}
      <RatingFilter
        filters={filters}
        setFilters={setFilters}
        ratingsCount={2}
      />
      <CategoryFilter
        filters={filters}
        setFilters={setFilters}
        allCategories={allCategories}
      />
    </aside>
  );
}

export default ProductFilter;
