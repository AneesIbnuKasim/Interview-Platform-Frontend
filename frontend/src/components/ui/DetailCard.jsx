import React from 'react'

const DetailCard = ({ 
  icon, 
  iconColor = 'primary',
  label, 
  value,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: { icon: 'fs-5', spacing: 'me-2' },
    md: { icon: 'fs-4', spacing: 'me-3' },
    lg: { icon: 'fs-3', spacing: 'me-3' }
  }
  
  const { icon: iconClass, spacing } = sizeClasses[size] || sizeClasses.md
  
  return (
    <div className={`card border-0 bg-light h-100 ${className}`}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <i className={`bi ${icon} text-${iconColor} ${iconClass} ${spacing}`}></i>
          <div className="flex-grow-1">
            <h6 className="mb-0">{label}</h6>
            <div className="text-muted">
              {value}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailCard