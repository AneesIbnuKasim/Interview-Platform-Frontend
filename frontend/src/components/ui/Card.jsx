import React from 'react';
import { CARD_STYLES, GRADIENTS } from '../../constants/ui';

const Card = ({
  children,
  className = '',
  style = {},
  title,
  subtitle,
  icon,
  gradient,
  headerActions,
  footer,
  height = 'auto',
  loading = false,
  ...props
}) => {
  const cardClasses = `card ${CARD_STYLES.shadow} ${className}`;
  const cardStyle = {
    borderRadius: CARD_STYLES.borderRadius,
    border: CARD_STYLES.border,
    height,
    ...style
  };

  const headerStyle = gradient
    ? {
        background: GRADIENTS[gradient] || gradient,
        borderRadius: `${CARD_STYLES.borderRadius} ${CARD_STYLES.borderRadius} 0 0`,
        color: 'white'
      }
    : {};

  if (loading) {
    return (
      <div className={cardClasses} style={cardStyle} {...props}>
        <div className="card-body d-flex justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClasses} style={cardStyle} {...props}>
      {(title || subtitle || icon || headerActions) && (
        <div className="card-header border-0" style={headerStyle}>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {icon && (
                <i className={`${icon} me-2`} style={{ fontSize: '1.25rem' }}></i>
              )}
              <div>
                {title && (
                  <h5 className="mb-0 fw-bold">
                    {title}
                  </h5>
                )}
                {subtitle && (
                  <small className={gradient ? 'text-white-50' : 'text-muted'}>
                    {subtitle}
                  </small>
                )}
              </div>
            </div>
            {headerActions && <div>{headerActions}</div>}
          </div>
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer bg-transparent border-0">
          {footer}
        </div>
      )}
    </div>
  );
};


export default Card;