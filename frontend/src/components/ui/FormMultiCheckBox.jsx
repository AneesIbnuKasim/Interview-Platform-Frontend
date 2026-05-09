const FormMultiCheckbox = ({
  label,
  name,
  options = [],
  values = [],
  setFieldValue,
  error,
}) => {
  const handleChange = (value) => {
    if (values.includes(value)) {
      setFieldValue(
        name,
        values.filter((v) => v !== value)
      );
    } else {
      setFieldValue(name, [...values, value]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={() => handleChange(option.value)}
              className="w-4 h-4 accent-black"
            />
            <span className="text-sm">{option.label}</span>
          </label>
        ))}
      </div>

      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};

export default FormMultiCheckbox;