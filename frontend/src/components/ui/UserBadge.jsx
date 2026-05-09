import React from 'react'
import StatusBadge from './StatusBadge'

const UserBadge = ({ type, value, size = 'md', className = '' }) => {
  const badgeType = type === 'status' ? 'user-status' : 'user-role'
  
  return (
    <StatusBadge 
      type={badgeType} 
      value={value} 
      size={size}
      className={className}
    />
  )
}

export default UserBadge