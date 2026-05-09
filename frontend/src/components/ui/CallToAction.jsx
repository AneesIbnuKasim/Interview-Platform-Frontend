import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton,
  bgVariant = 'primary',
  className = '' 
}) => {
  
  const bgColors = {
    primary: 'bg-blue-600',
    secondary: 'bg-gray-700',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-500',
    dark: 'bg-gray-900',
    light: 'bg-gray-100 text-gray-900'
  };

  const renderButton = (button, isPrimary = true) => {
    if (!button) return null;

    const baseClasses = isPrimary
      ? `px-6 py-3 text-lg rounded-lg font-medium text-white bg-${button.variant || 'blue'}-600 hover:bg-${button.variant || 'blue'}-700 transition`
      : `px-6 py-3 text-lg rounded-lg font-medium border border-${button.variant || 'blue'}-600 text-${button.variant || 'blue'}-600 hover:bg-${button.variant || 'blue'}-600 hover:text-white transition`;

    // React Router Link
    if (button.to) {
      return (
        <Link to={button.to} className={baseClasses}>
          {button.icon && <i className={`${button.icon} mr-2`}></i>}
          {button.text}
        </Link>
      );
    }

    // Anchor link
    if (button.href) {
      return (
        <a href={button.href} target={button.target} className={baseClasses}>
          {button.icon && <i className={`${button.icon} mr-2`}></i>}
          {button.text}
        </a>
      );
    }

    // Regular button
    return (
      <button onClick={button.onClick} className={baseClasses}>
        {button.icon && <i className={`${button.icon} mr-2`}></i>}
        {button.text}
      </button>
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <div className={`${bgColors[bgVariant] || bgColors.primary} rounded-xl`}>
        <div className="text-center px-6 py-12">
          <h3 className="text-3xl font-semibold mb-3">{title}</h3>
          {subtitle && <p className="text-lg opacity-90 mb-6">{subtitle}</p>}
          
          <div className="flex justify-center flex-wrap gap-4">
            {renderButton(primaryButton, true)}
            {renderButton(secondaryButton, false)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;