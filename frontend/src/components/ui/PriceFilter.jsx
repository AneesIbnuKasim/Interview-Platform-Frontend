
import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PriceFilter({
  filters,
  setFilters
}) {
    const [values, setValues] = useState([0,1500])

  const handleChange = (val) => {
    setValues(val)
  };

  useEffect(() => {
    const minVal = filters.minPrice || values[0]
    const maxVal = filters.maxPrice || values[1]
    setValues([minVal, maxVal])
  }, [filters.minPrice, filters.maxPrice])
  
  const handlePriceFilter = ()=>{
    setFilters({minPrice: values[0]})
    setFilters({maxPrice: values[1]})
  }

  return (
    <div className="w-full">
      <h4 className="text-lg font-semibold text-secondary mb-4">Price Range</h4>

      {/* Slider */}
     <div className="flex items-center gap-5  ">
         <RangeSlider
        min={0}
        max={100000}
        step={10}
        value={values}
        thumbSize={4}
        onInput={handleChange}
        className="accent-purple-500"
        />
        <button className= " border border-purple-500 p-1 hover:bg-purple-500 hover:text-white rounded-xl" type="button" onClick={handlePriceFilter}>Go</button>
     </div>
      

      <div className="text-center w-[80%] helper text-sm mb-3">
        Rs.{values[0]} — Rs.{values[1]}
        
      </div>
      
    </div>
  );
}