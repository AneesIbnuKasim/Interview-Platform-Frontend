import React, { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Slider({
  title = "",
  items = [],
  renderItem,  
  itemWidth = 250,     
  className = "",
  handleClick
}) {
  const sliderRef = useRef(null);

  const scroll = useCallback((direction) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = slider.clientWidth / 1.2;

    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  })

  if (!items || items.length === 0) return null;

  return (
    <div className={`w-full mt-10 ${className}`}>
      {/* Title */}
      {title && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}

      <div className="relative">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 
                     bg-card shadow-md w-10 h-10 rounded-full items-center justify-center"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Slider */}
        <div
          ref={sliderRef}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar px-1"
        >
          {items.map((item, index) => (
            <div
              key={item._id || index}
              className="shrink-0 max-w-65"
              style={{ minWidth: itemWidth }}
              onClick={()=>handleClick(item._id)}
              >
              {renderItem(item)}
            </div>
          ))}
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 
                     bg-card shadow-md w-10 h-10 rounded-full items-center justify-center"
        >
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}