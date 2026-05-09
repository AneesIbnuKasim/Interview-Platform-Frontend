import React from 'react'
import DateDisplay from './DateDisplay'

const UserSummary = ({ user, className = '' }) => {
  if (!user) return null
  
  return (
    <div className={`bg-light p-3 rounded ${className}`}>
      <div className="row g-2">
        <div className="col-sm-6">
          <strong>User:</strong> {user.name}
        </div>
        <div className="col-sm-6">
          <strong>Email:</strong> {user.email}
        </div>
        <div className="col-sm-6">
          <strong>Role:</strong> {user.role}
        </div>
        <div className="col-sm-6">
          <strong>Joined:</strong>{' '}
          <DateDisplay 
            date={user.createdAt} 
            format="short"
            className="text-muted"
          />
        </div>
      </div>
    </div>
  )
}

export default UserSummary