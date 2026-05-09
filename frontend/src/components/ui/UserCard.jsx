import React from 'react'
import UserAvatar from './UserAvatar'
import UserBadge from './UserBadge'
import UserActions from './UserActions'
import DateDisplay from './DateDisplay'

const UserCard = ({ 
  user, 
  onBanUser, 
  onUnbanUser, 
  onViewDetails 
}) => {

  return (
    <div className="col-lg-4 col-md-6">
      <div className="card h-100 hover-lift glass-card border-0 shadow-lg">
        <div className="card-body text-center p-4">
          <UserAvatar 
            user={user} 
            size="md" 
            className="mx-auto mb-3" 
          />
          <h5 className="card-title mb-2">{user.name}</h5>
          <p className="text-muted small mb-3">{user.email}</p>
          
          <div className="d-flex justify-content-center gap-2 mb-3">
            <UserBadge type="role" value={user.role} />
            <UserBadge type="status" value={user.status} />
          </div>

          <div className="d-block mb-3">
            <DateDisplay 
              date={user.createdAt} 
              prefix="Joined:" 
              className="text-muted small"
            />
          </div>

          <UserActions
            user={user}
            onBanUser={onBanUser}
            onUnbanUser={onUnbanUser}
            onViewDetails={onViewDetails}
            variant="buttons"
          />
        </div>
      </div>
    </div>
  )
}

export default UserCard