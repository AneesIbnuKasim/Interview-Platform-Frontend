const FormDateInput = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        type="date"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black
          ${error ? "border-red-500" : "border-gray-300"}`}
      />

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default FormDateInput;