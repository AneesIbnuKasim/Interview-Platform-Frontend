import React, { forwardRef, useMemo, memo } from 'react';

const FormInput = memo(
  forwardRef(
    (
      {
        label,
        labelColor= 'text-gray-700',
        type = 'text',
        placeholder,
        icon,
        error,
        helpText,
        className = '',
        fieldClassName= '',
        inputGroupClassName = '',
        required = false,
        ...props
      },
      ref
    ) => {
      const inputId = useMemo(
        () =>
          props.id ||
          props.name ||
          `input-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        [props.id, props.name]
      )

      const inputClassName = useMemo(() => {
        const baseClasses =
          `block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${fieldClassName} input`
        const errorClasses = error
          ? 'border-red-500 focus:border-red-500 focus:ring-red-500 input-error'
          : ''
        return `${baseClasses} ${errorClasses}`;
      }, [error])

      const containerClassName = useMemo(() => `mb-4 ${className}`, [className]);

      const groupClassName = useMemo(
        () =>
          `flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 ${inputGroupClassName}`,
        [inputGroupClassName]
      )

      const labelElement = useMemo(() => {
        if (!label) return null
        return (
          <label
            htmlFor={inputId}
            className={`block mb-2 text-sm font-medium `}
          >
            {label}
            {required && <span className="text-red-600 ml-1">*</span>}
          </label>
        )
      }, [label, inputId, required])

      const inputElement = useMemo(() => {
        if (icon) {
          // Input inside group will have no border because group handles border
          return (
            <input
              ref={ref}
              type={type}
              className="block w-full min-h-full border-0 focus:ring-0 focus:outline-0 text-md input::placeholder "
              id={inputId}
              placeholder={placeholder}
              required={required}
              {...props}
            />
          )
        }

        // Plain input without icon
        return (
          <input
            ref={ref}
            type={type}
            className={inputClassName}
            id={inputId}
            placeholder={placeholder}
            required={required}
            {...props}
          />
        )
      }, [ref, type, inputClassName, inputId, placeholder, required, props, icon])

      const errorElement = useMemo(() => {
        if (!error) return null
        return (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )
      }, [error])

      const helpElement = useMemo(() => {
        if (!helpText || error) return null
        return <p className="mt-1 text-sm helper">{helpText}</p>
      }, [helpText, error])

      const iconElement = icon ? (
        <span className=" text-gray-400">
          {icon}
        </span>
      ) : null

      return (
        <div className={`h-full mt-4 ${containerClassName}`}>
          {labelElement}
          {icon ? (
            <div className={` ${groupClassName}`}>
              <span className={`mr-2 `}>{iconElement}</span>
              {inputElement}
            </div>
          ) : (
            <>
              {inputElement}
            </>
          )}

          {errorElement}
          {helpElement}
        </div>
      );
    }
  )
);

FormInput.displayName = 'FormInput'

export default FormInput
