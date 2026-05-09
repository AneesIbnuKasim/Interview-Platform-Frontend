import React from 'react'
import UserAvatar from './UserAvatar'
import UserBadge from './UserBadge'

const UserProfile = ({ 
  user, 
  showBadges = true,
  layout = 'vertical', // 'vertical' or 'horizontal'
  avatarSize = 'md',
  className = ''
}) => {
  const isVertical = layout === 'vertical'
  
  return (
    <div className={`${isVertical ? 'text-center' : 'flex align-items-center'} ${className}`}>
      <UserAvatar 
        user={user} 
        size={avatarSize} 
        className={isVertical ? 'mx-auto mb-3' : 'me-3'} 
      />
      <div className={isVertical ? '' : 'grow'}>
        <h5 className={isVertical ? 'mb-1' : 'mb-0'}>{user?.name}</h5>
        <p className={`text-muted ${isVertical ? 'mb-3' : 'mb-0 small'}`}>
          {user?.email}
        </p>
        {showBadges && (
          <div className={`${isVertical ? 'd-flex justify-content-center gap-2' : 'd-flex gap-2'}`}>
            <UserBadge type="role" value={user?.role} />
            <UserBadge type="status" value={user?.status} />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfile