import Select from '../ui/Select';

function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  size = 'md',
  className = '',
  ...rest
}) {
  const selectId = `select-${name}`;
  const helpId   = `help-select-${name}`;
  const errorId  = `error-select-${name}`;
  const describedBy = error ? errorId : helperText ? helpId : undefined;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-semibold text-deep-blue mb-2">
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}

      <Select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        options={options}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        aria-required={required}
        aria-describedby={describedBy}
        {...rest}
      />

      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">{error}</p>
      )}
      {helperText && !error && (
        <p id={helpId} className="text-xs text-[#AAAAAA] mt-1">{helperText}</p>
      )}
    </div>
  );
}

export default FormSelect;
