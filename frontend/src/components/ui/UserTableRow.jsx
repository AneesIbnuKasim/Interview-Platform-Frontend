import React from 'react'
import UserAvatar from './UserAvatar'
import UserBadge from './UserBadge'
import UserActions from './UserActions'
import DateDisplay from './DateDisplay'

const UserTableRow = ({ 
  user, 
  onBanUser, 
  onUnbanUser, 
  onViewDetails 
}) => {

  return (
    <tr className="hover-row">
      <td>
        <UserAvatar 
          user={user} 
          size="sm" 
          showName={true} 
          showEmail={true} 
        />
      </td>
      <td>
        <UserBadge type="role" value={user.role} />
      </td>
      <td>
        <UserBadge type="status" value={user.status} />
      </td>
      <td>
        <DateDisplay 
          date={user.createdAt} 
          className="text-muted small"
        />
      </td>
      <td>
        <UserActions
          user={user}
          onBanUser={onBanUser}
          onUnbanUser={onUnbanUser}
          onViewDetails={onViewDetails}
          variant="group"
        />
      </td>
    </tr>
  )
}

export default UserTableRow