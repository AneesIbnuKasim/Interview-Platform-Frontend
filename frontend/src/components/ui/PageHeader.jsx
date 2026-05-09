import React, { memo, useMemo } from 'react';

const PageHeader = memo(({ 
  title, 
  subtitle, 
  icon, 
  actions, 
  className = '',
  variant = 'default',
  iconBg = 'primary'
}) => {
  const iconElement = useMemo(() => {
    if (!icon) return null;

    if (variant === 'hero') {
      return (
        <div className={`bg-${iconBg} rounded-circle d-inline-flex align-items-center justify-content-center mb-3`} 
             style={{ width: '80px', height: '80px' }}>
          <i className={`${icon} text-white fs-1`}></i>
        </div>
      );
    }

    if (variant === 'centered') {
      return <i className={`${icon} fs-2 text-${iconBg} mb-2`}></i>;
    }

    return <i className={`${icon} fs-4 text-${iconBg} me-3`}></i>;
  }, [icon, variant, iconBg]);

  const subtitleElement = useMemo(() => {
    if (!subtitle) return null;

    if (variant === 'hero') {
      return <p className="lead text-muted">{subtitle}</p>;
    }

    if (variant === 'centered') {
      return <p className="text-muted">{subtitle}</p>;
    }

    return <p className="text-muted mb-0">{subtitle}</p>;
  }, [subtitle, variant]);

  const actionsElement = useMemo(() => {
    if (!actions) return null;

    const wrapperClass = variant === 'hero' ? 'mt-4' : variant === 'centered' ? 'mt-3' : '';
    
    return (
      <div className={wrapperClass}>
        {actions}
      </div>
    );
  }, [actions, variant]);

  if (variant === 'hero') {
    return (
      <div className={`text-center mb-5 ${className}`}>
        {iconElement}
        <h1 className="display-4 fw-bold text-dark mb-3">{title}</h1>
        {subtitleElement}
        {actionsElement}
      </div>
    );
  }

  if (variant === 'centered') {
    return (
      <div className={`text-center mb-4 ${className}`}>
        {iconElement}
        <h1 className="h3 mb-2">{title}</h1>
        {subtitleElement}
        {actionsElement}
      </div>
    );
  }

  return (
    <div className={`d-flex justify-content-between align-items-center mb-4 ${className}`}>
      <div className="d-flex align-items-center">
        {iconElement}
        <div>
          <h1 className="h3 mb-0">{title}</h1>
          {subtitleElement}
        </div>
      </div>
      {actionsElement}
    </div>
  );
});

export default PageHeader;