import React from 'react';

const TabNavigation = ({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'default', // default, pills, underline
  className = ''
}) => {
  if (!tabs || !tabs.length) return null;

  const getTabClasses = (tab) => {
    const baseClasses = variant === 'pills' 
      ? 'nav-link' 
      : variant === 'underline' 
      ? 'nav-link border-0 border-bottom' 
      : 'list-group-item list-group-item-action';
      
    const activeClasses = activeTab === tab.key ? 'active' : '';
    
    return `${baseClasses} ${activeClasses}`;
  };

  if (variant === 'pills' || variant === 'underline') {
    return (
      <ul className={`nav ${variant === 'pills' ? 'nav-pills' : 'nav-tabs'} ${className}`}>
        {tabs.map((tab) => (
          <li key={tab.key} className="nav-item">
            <button
              className={getTabClasses(tab)}
              onClick={() => onTabChange(tab.key)}
              type="button"
            >
              {tab.icon && <i className={`${tab.icon} me-2`}></i>}
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`list-group list-group-flush ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={getTabClasses(tab)}
          onClick={() => onTabChange(tab.key)}
          type="button"
        >
          {tab.icon && <i className={`${tab.icon} me-2`}></i>}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;