import React from 'react'

const EmptyState = ({ 
  icon = 'bi-inbox',
  title = 'No data found',
  description = 'There are no items to display',
  iconSize = '4rem',
  className = ''
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      <i 
        className={`bi ${icon} text-muted`}
        style={{ fontSize: iconSize }}
      ></i>
      <h5 className="text-muted mt-3">{title}</h5>
      <p className="text-muted">{description}</p>
    </div>
  )
}

export default EmptyState