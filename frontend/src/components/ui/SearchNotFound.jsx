import React, { memo } from 'react'

const SearchNotFound = memo(({searchQuery}) =>  {

  return (
    <div className='flex flex-col h-100 justify-center items-center'>
      <div >
        <h1 className='h2'> No results found for search "{searchQuery}"</h1>
      <h3>Try adjusting your search or using different keywords.</h3>
      </div>
    </div>
  )
}
)

export default SearchNotFound
