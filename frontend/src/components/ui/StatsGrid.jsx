import React, { memo, useMemo } from 'react';

const StatsGrid = memo(({ 
  stats, 
  columns = 4, 
  className = '',
  cardVariant = 'default'
}) => {
  const columnClass = useMemo(() => {
    switch (columns) {
      case 2: return 'col-md-6';
      case 3: return 'col-md-6 col-lg-4';
      case 4: return 'col-md-6 col-lg-3';
      case 6: return 'col-md-6 col-lg-4 col-xl-2';
      default: return 'col-md-6 col-lg-3';
    }
  }, [columns]);

  const containerClass = useMemo(() => 
    `row g-4 ${className}`,
    [className]
  );

  const cardClass = useMemo(() => 
    `card h-100 border-0 ${cardVariant === 'gradient' ? '' : 'shadow-sm'}`,
    [cardVariant]
  );

  const statItems = useMemo(() => {
    if (!stats?.length) return [];

    return stats.map((stat, index) => (
      <div key={stat.id || index} className={columnClass}>
        <div className={cardClass}>
          <div className="card-body text-center p-4">
            {stat.icon && (
              <i 
                className={`${stat.icon} ${stat.iconColor ? `text-${stat.iconColor}` : 'text-primary'} mb-3`} 
                style={{ fontSize: stat.iconSize || '3rem' }}
              ></i>
            )}
            <h5 className="card-title">{stat.title}</h5>
            <p className="card-text text-muted">{stat.value}</p>
          </div>
        </div>
      </div>
    ));
  }, [stats, columnClass, cardClass]);

  if (!stats?.length) return null;

  return (
    <div className={containerClass}>
      {statItems}
    </div>
  );
});

export default StatsGrid;