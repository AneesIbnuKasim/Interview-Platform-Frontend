import React, { memo } from 'react'

const RatingFilter = memo(({
  filters,
  setFilters,
  ratingsCount
}) => {
    const handleFilter = (e) => {
    const star = Number(e.target.value); 
    const rating = filters.rating ?? []

    const updatedRating = rating.includes(star) ? rating.filter(r => r !== star) : [...rating, star]
    setFilters({rating: updatedRating})
  }
  
  return (
    <>
            <div className="mb-8">
        <h4 className="font-medium mb-3 text-[15px]">By Rating</h4>
        {[5,4,3,2,1].map((star) => (
          <label
            key={star}
            className="flex items-center justify-between mb-2 text-sm cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: star }).map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                value={star}
                checked={filters.rating.includes(star)}
                onChange={(e) => handleFilter(e)}
              />
              {/* <span>({ratingsCount[star] || 0})</span> */}
            </div>
          </label>
        ))}
      </div>
    </>
  )
})

export default RatingFilter
