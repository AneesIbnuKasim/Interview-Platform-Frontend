import React from 'react';

const InfoCard = ({ 
  icon, 
  title, 
  description, 
  iconColor = 'primary', 
  className = '',
  iconSize = '3rem',
  onClick,
  href,
  variant = 'default' // default, centered, action
}) => {
  const cardContent = (
    <div className={`card h-100 border-0 shadow-sm ${onClick || href ? 'cursor-pointer' : ''}`}>
      <div className={`card-body ${variant === 'centered' ? 'text-center' : ''} p-4`}>
        {icon && (
          <i 
            className={`${icon} text-${iconColor} ${variant === 'centered' ? 'mb-3' : 'me-3'}`} 
            style={{ fontSize: iconSize }}
          ></i>
        )}
        <div className={variant === 'centered' ? '' : 'd-inline-block'}>
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted">{description}</p>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <div className={className}>
        <a href={href} className="text-decoration-none">
          {cardContent}
        </a>
      </div>
    );
  }

  if (onClick) {
    return (
      <div className={className} onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <div className={className}>
      {cardContent}
    </div>
  );
};

export default InfoCard;