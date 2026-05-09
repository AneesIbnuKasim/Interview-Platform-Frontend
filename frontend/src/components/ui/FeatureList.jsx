import React, { memo, useMemo } from 'react';

const FeatureList = memo(({ 
  features, 
  variant = 'horizontal',
  iconBg = 'primary',
  className = ''
}) => {
  const iconBgClass = useMemo(() => {
    if (iconBg === 'white') {
      return 'bg-white bg-opacity-20';
    }
    return `bg-${iconBg} bg-opacity-20`;
  }, [iconBg]);

  const columnClass = useMemo(() => 
    variant === 'horizontal' ? 'col-md-6' : 'col-12',
    [variant]
  );

  const containerClass = useMemo(() => 
    `row g-3 ${className}`,
    [className]
  );

  const featureItems = useMemo(() => {
    if (!features?.length) return [];
    
    return features.map((feature, index) => (
      <div key={feature.id || index} className={columnClass}>
        <div className="d-flex align-items-center">
          <div className={`${iconBgClass} rounded-circle p-2 me-3`}>
            <i className={feature.icon}></i>
          </div>
          <div>
            <h6 className="mb-1">{feature.title}</h6>
            <small className="opacity-75">{feature.description}</small>
          </div>
        </div>
      </div>
    ));
  }, [features, columnClass, iconBgClass]);

  if (!features?.length) return null;

  return (
    <div className={containerClass}>
      {featureItems}
    </div>
  );
});

export default FeatureList;