import React, { memo } from 'react'
import { useProduct } from '../../context/ProductContext'

const GenderFilter = memo(() => {

  const { filters, setFilters } = useProduct()
  const gender = ['Men']
  
  return (
    <>
     <div className="mb-8">
        <h4 className="font-medium mb-3 text-[15px]">Gender</h4>
        {["Men", "Women", "Kids"].map((g) => (
          <label className="flex items-center gap-2 mb-2 text-sm" key={g}>
            <input
              type="checkbox"
              checked={gender.includes(g)}
              onChange={() => handleCheckbox("gender", g)}
              className="rounded"
            />
            {g}
          </label>
        ))}
      </div> 
    </>
  )
})

export default GenderFilter
