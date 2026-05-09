import React, { memo, useMemo, useCallback } from 'react';

const ButtonGroup = memo(({ 
  buttons, 
  activeKey, 
  onSelect, 
  variant = 'outline-primary',
  size = 'md',
  className = '' 
}) => {
  const sizeClass = useMemo(() => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      default: return '';
    }
  }, [size]);

  const colWidth = useMemo(() => {
    if (!buttons?.length) return 12;
    return 12 / buttons.length;
  }, [buttons?.length]);

  const handleButtonClick = useCallback((buttonKey) => {
    onSelect?.(buttonKey);
  }, [onSelect]);

  const memoizedButtons = useMemo(() => {
    if (!buttons?.length) return [];
    
    return buttons.map((button, index) => {
      const key = button.key ?? button.value ?? index;
      const isActive = activeKey === key;
      
      return (
        <div key={key} className={`col-${colWidth}`}>
          <button
            type="button"
            onClick={() => handleButtonClick(key)}
            className={`btn btn-${button.variant || variant} w-100 ${sizeClass} ${
              isActive ? 'active' : ''
            }`}
          >
            {button.icon && <i className={`${button.icon} me-2`}></i>}
            {button.label || button.text}
          </button>
        </div>
      );
    });
  }, [buttons, colWidth, activeKey, variant, sizeClass, handleButtonClick]);

  if (!buttons?.length) return null;

  return (
    <div className={`row g-2 ${className}`}>
      {memoizedButtons}
    </div>
  );
});

export default ButtonGroup;