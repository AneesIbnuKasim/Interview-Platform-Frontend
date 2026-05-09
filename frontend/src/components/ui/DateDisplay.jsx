import React from 'react'

const DateDisplay = ({ 
  date, 
  format = 'short', 
  prefix = '',
  fallback = 'N/A',
  className = 'text-muted'
}) => {
  const formatDate = (date, format) => {
    if (!date) return fallback
    
    const dateObj = new Date(date)
    
    switch (format) {
      case 'short':
        return dateObj.toLocaleDateString()
      case 'long':
        return dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      case 'relative':
        const now = new Date()
        const diffTime = Math.abs(now - dateObj)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
        return `${Math.ceil(diffDays / 365)} years ago`
      
      case 'time':
        return dateObj.toLocaleString()
      
      default:
        return dateObj.toLocaleDateString()
    }
  }

  const formattedDate = formatDate(date, format)
  
  return (
    <span className={className}>
      {prefix && `${prefix} `}{formattedDate}
    </span>
  )
}

export default DateDisplay