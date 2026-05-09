import React, { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BUTTON_VARIANTS, BUTTON_SIZE } from '../../constants/ui'
import { ImSpinner } from "react-icons/im"

// 'radial-gradient(circle,#3F4DBC_33%,#A24FBC_91%)'
const Button = memo(({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  onClick,
  to,
  href,
  target,
  type = 'button',
  baseClass = '',
  pill = false,
  block = false,
  ...props
}) => {

  /** Generate button classes dynamically */
  const buttonClasses = useMemo(() => {
    const baseClasses =
      `inline-flex items-center justify-center font-medium transition-all duration-200
       min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed ${baseClass}`;

    const variantClass = variant.includes('outline-')
      ? BUTTON_VARIANTS.outline?.[variant.replace('outline-', '')] ||
        BUTTON_VARIANTS.primary
      : BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;

    const sizeClass = BUTTON_SIZE[size] || BUTTON_SIZE.md;
    const pillClass = pill ? 'rounded-full' : 'rounded-md';
    const blockClass = block ? 'w-full' : '';

    return [
      baseClasses,
      variantClass,
      sizeClass,
      pillClass,
      blockClass,
      className
    ].filter(Boolean).join(' ');
  }, [variant, size, pill, block, className]);


  /** Handle click with disabled + loading protection */
  const handleClick = useCallback((e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  }, [onClick, disabled, loading]);


  /** UI content logic for icons + spinner */
  const content = useMemo(() => {
    const iconEl = icon && (
      <i className={`${icon} ${loading ? <ImSpinner /> : ''}`} />
    );

    if (loading) {
      return (
        <>
          <span className="animate-spin mr-2 border-2 border-white border-t-transparent w-4 h-4 rounded-full"></span>
          {children}
        </>
      );
    }

    if (icon) {
      return iconPosition === 'left'
        ? <><span className="mr-2">{icon}</span>{children}</>
        : <>{children}<span className="ml-2">{icon}</span></>;
    }

    return children;
  }, [icon, loading, children, iconPosition]);


  // ---- Routing Smart Rendering ----
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={buttonClasses}
        style={style}
        onClick={handleClick}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      style={style}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;