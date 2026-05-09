import React from 'react'

const UserActions = ({ 
  user, 
  onBanUser, 
  onUnbanUser, 
  onViewDetails,
  variant = 'buttons', // 'buttons' or 'group'
  size = 'sm'
}) => {
  const buttonClass = `btn btn-outline-primary${variant === 'group' ? '' : ` btn-${size}`}`
  const successClass = `btn btn-outline-success${variant === 'group' ? '' : ` btn-${size}`}`
  const dangerClass = `btn btn-outline-danger${variant === 'group' ? '' : ` btn-${size}`}`
  
  const actions = (
    <>
      <button
        className={buttonClass}
        onClick={() => onViewDetails(user)}
        title="View Details"
      >
        <i className="bi bi-eye me-1"></i>
        {variant === 'buttons' ? 'Details' : ''}
      </button>
      
      {user.status === 'banned' ? (
        <button
          className={successClass}
          onClick={() => onUnbanUser(user._id)}
          title="Unban User"
        >
          <i className="bi bi-check-circle me-1"></i>
          {variant === 'buttons' ? 'Unban' : ''}
        </button>
      ) : user.role !== 'admin' && (
        <button
          className={dangerClass}
          onClick={() => onBanUser(user)}
          title="Ban User"
        >
          <i className="bi bi-x-circle me-1"></i>
          {variant === 'buttons' ? 'Ban' : ''}
        </button>
      )}
    </>
  )
  
  if (variant === 'group') {
    return (
      <div className="btn-group btn-group-sm" role="group">
        {actions}
      </div>
    )
  }
  
  return (
    <div className="d-flex justify-content-center gap-2">
      {actions}
    </div>
  )
}

export default UserActions