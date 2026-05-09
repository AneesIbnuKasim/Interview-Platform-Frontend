import React, { forwardRef, useMemo, memo } from "react";

const FormSelect = memo(
  forwardRef(
    (
      {
        label,
        labelColor = "text-gray-700",
        required = false,
        options = [],
        placeholder = "Select an option",
        error,
        helpText,
        className = "",
        fieldClassName = "",
        ...props
      },
      ref
    ) => {
      const selectId = useMemo(
        () =>
          props.id ||
          props.name ||
          `select-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 5)}`,
        [props.id, props.name]
      );

      const containerClassName = useMemo(
        () => `h-full mt-4 mb-4 ${className}`,
        [className]
      );

      const selectClassName = useMemo(() => {
        const base =
          `input block w-full rounded-md border border-gray-300 bg-white px-3 py-[10px] input::placeholder focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${fieldClassName}`
        const errorCls = error
          ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          : "";
        return `${base} ${fieldClassName} ${errorCls}`;
      }, [error, fieldClassName]);

      const labelElement = label ? (
        <label
          htmlFor={selectId}
          className={`block mb-2 text-sm font-medium`}
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

          <select
            ref={ref}
            id={selectId}
            required={required}
            className={selectClassName}
            {...props}
          >
            {placeholder && (
              <option value="" >
                {placeholder}
              </option>
            )}

            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {errorElement}
          {helpElement}
        </div>
      );
    }
  )
);

FormSelect.displayName = "FormSelect";

export default FormSelect;