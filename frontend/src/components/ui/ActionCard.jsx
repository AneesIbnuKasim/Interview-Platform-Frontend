import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';

const ActionCard = memo(({ 
  icon, 
  title, 
  description, 
  buttonText, 
  buttonVariant = 'primary',
  to,
  href,
  onClick,
  iconColor = 'primary',
  className = ''
}) => {
  const buttonClass = useMemo(() => 
    `btn btn-${buttonVariant}`,
    [buttonVariant]
  );

  const iconClass = useMemo(() => 
    `${icon} text-${iconColor} mb-3`,
    [icon, iconColor]
  );

  const handleClick = useCallback((e) => {
    onClick?.(e);
  }, [onClick]);

  const button = useMemo(() => {
    if (!buttonText) return null;

    if (to) {
      return (
        <Link to={to} className={buttonClass}>
          {buttonText}
        </Link>
      );
    }
    
    if (href) {
      return (
        <a href={href} className={buttonClass}>
          {buttonText}
        </a>
      );
    }
    
    if (onClick) {
      return (
        <button onClick={handleClick} className={buttonClass}>
          {buttonText}
        </button>
      );
    }
    
    return null;
  }, [to, href, onClick, buttonText, buttonClass, handleClick]);

  const iconElement = useMemo(() => {
    if (!icon) return null;
    return (
      <i className={iconClass} style={{ fontSize: '2.5rem' }}></i>
    );
  }, [icon, iconClass]);

  return (
    <div className={className}>
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body text-center p-4">
          {iconElement}
          <h5 className="card-title">{title}</h5>
          <p className="card-text text-muted mb-3">{description}</p>
          {button}
        </div>
      </div>
    </div>
  );
});

export default ActionCard;