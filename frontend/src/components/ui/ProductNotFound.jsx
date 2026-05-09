import React, { memo } from 'react'

const ProductNotFound = memo(({keyWord='', content='', sub=''}) =>  {

  return (
     <div className="flex w-full bg-blend-hard-light items-center justify-center">
    <div className='flex flex-col h-100 justify-center items-center'>
      <div >
        <h1 className='h2'> {keyWord}</h1>
      <h3 className='h2'>{content}</h3>
      <h3>{sub}</h3>
      </div>
    </div>
            </div>
  )
}
)

export default ProductNotFound
