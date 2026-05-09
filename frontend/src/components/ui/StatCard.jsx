import React from 'react';

const StatCard = ({
  icon,
  iconBg = 'primary',
  value,
  title,
  subtitle,
  progressValue = 100,
  progressColor = 'white',
  className = ''
}) => {
  return (
    <div className={`col-lg-3 col-md-6 ${className}`}>
      <div className="card border-0 shadow-lg h-100 hover-lift glass-card">
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className={`stat-icon bg-gradient-${iconBg} text-white`}>
              <i className={icon}></i>
            </div>
            <div className="text-end">
              <div className={`animated-counter text-${iconBg}`}>
                {value}
              </div>
              <h6 className="text-muted mb-0">{title}</h6>
              {subtitle && (
                <small className={typeof subtitle === 'string' ? `text-${iconBg}` : ''}>
                  {subtitle}
                </small>
              )}
            </div>
          </div>
          <div className="progress" style={{ height: "6px", borderRadius: "10px" }}>
            <div
              className={`progress-bar bg-${progressColor}`}
              style={{ 
                width: `${progressValue}%`,
                borderRadius: "10px"
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;