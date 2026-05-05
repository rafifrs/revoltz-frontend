import Input from '../ui/Input';

function FormInput({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  size = 'md',
  className = '',
  ...rest
}) {
  const inputId = `input-${name}`;
  const helpId = `help-${name}`;
  const errorId = `error-${name}`;
  const describedBy = error ? errorId : helperText ? helpId : undefined;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-deep-blue mb-2"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <Input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        aria-required={required}
        aria-describedby={describedBy}
        {...rest}
      />

      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helpId} className="text-xs text-[#AAAAAA] mt-1">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default FormInput;
