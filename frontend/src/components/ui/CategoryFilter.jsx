import { Search } from 'lucide-react'
import React, { memo, useState } from 'react'

const CategoryFilter = memo(({
  filters,
  setFilters,
  allCategories
}) => {

  const [ search, setSearch ] = useState('')

  const handleFilter = (c) => {
    const categories = filters.category ?? []

    const updatedCategories = categories.includes(c) ? categories.filter(category=> category!==c) : [...categories, c] 
    
    setFilters({category: updatedCategories})
    setSearch('')
  }
  
  const visibleCategories = search.trim() ? allCategories.filter(cat => cat.toLowerCase().includes(search.toLowerCase())) : allCategories
  
  return (
    <>
      <div className="mb-4">
        <h4 className="font-medium mb-3 text-[15px]">Categories</h4>

        {/* Search box */}
        <div className="relative mb-3">
          <input
            type="text"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full p-2 pl-4 pr-10 rounded-full border text-sm"
          />
          <Search className="absolute right-3 top-3 text-gray-600" size={14} />
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-2 text-sm">
          {visibleCategories?.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={c}
                checked={filters.category?.includes(c)}
                onChange={() => handleFilter(c)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>
    </>
  )
})

export default CategoryFilter
