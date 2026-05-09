import React from 'react'

const StatusBadge = ({ 
  type, 
  value, 
  size = 'md',
  className = ''
}) => {
  const getConfig = (type, value) => {
    switch (type) {
      case 'connection':
        return value 
          ? { variant: 'success', icon: 'bi-wifi', text: 'Connected' }
          : { variant: 'danger', icon: 'bi-wifi-off', text: 'Offline' }
      
      case 'user-status':
        const statusConfig = {
          active: { variant: 'success', icon: 'bi-check-circle' },
          inactive: { variant: 'warning', icon: 'bi-clock' },
          banned: { variant: 'danger', icon: 'bi-x-circle' }
        }
        const config = statusConfig[value] || { variant: 'secondary', icon: 'bi-question-circle' }
        return { ...config, text: value?.toUpperCase() || 'UNKNOWN' }
      
      case 'user-role':
        const roleConfig = {
          admin: { variant: 'primary', icon: 'bi-shield-check' },
          user: { variant: 'info', icon: 'bi-person' }
        }
        const roleConf = roleConfig[value] || { variant: 'info', icon: 'bi-person' }
        return { ...roleConf, text: value?.toUpperCase() || 'USER' }
      
      default:
        return { variant: 'secondary', icon: 'bi-info-circle', text: value || 'N/A' }
    }
  }

  const getSizeClass = (size) => {
    const sizes = {
      sm: 'px-2 py-1',
      md: 'px-3 py-2',
      lg: 'px-4 py-2 fs-6'
    }
    return sizes[size] || sizes.md
  }

  const config = getConfig(type, value)
  const sizeClass = getSizeClass(size)
  
  return (
    <span className={`badge bg-${config.variant} ${sizeClass} ${className}`}>
      <i className={`bi ${config.icon} me-1`}></i>
      {config.text}
    </span>
  )
}

export default StatusBadge