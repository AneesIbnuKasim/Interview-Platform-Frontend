

import React, { forwardRef, useMemo, memo } from "react";

const FormTextarea = memo(
  forwardRef(
    (
      {
        label,
        labelColor = "text-gray-700",
        required = false,
        placeholder,
        error,
        helpText,
        className = "",
        fieldClassName = "",
        rows = 4,
        ...props
      },
      ref
    ) => {
      const inputId = useMemo(
        () =>
          props.id ||
          props.name ||
          `textarea-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 5)}`,
        [props.id, props.name]
      );

      const containerClassName = useMemo(
        () => `h-full mt-4 mb-4 ${className}`,
        [className]
      );

      const textareaClassName = useMemo(() => {
        const base =
          "block w-full rounded-md border border-gray-300 input px-3 py-2 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
        const errorCls = error
          ? "border-red-500 focus:border-red-500 input-error focus:ring-red-500"
          : "";
        return `${base} ${fieldClassName} ${errorCls}`;
      }, [error, fieldClassName]);

      const labelElement = label ? (
        <label
          htmlFor={inputId}
          className={`block mb-2 text-sm font-medium  `}
        >
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      ) : null;

      const errorElement = error ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null;

      const helpElement =
        helpText && !error ? (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        ) : null;

      return (
        <div className={containerClassName}>
          {labelElement}

          <textarea
            ref={ref}
            id={inputId}
            rows={rows}
            required={required}
            placeholder={placeholder}
            className={textareaClassName}
            {...props}
          />

          {errorElement}
          {helpElement}
        </div>
      );
    }
  )
);

FormTextarea.displayName = "FormTextarea";

export default FormTextarea;