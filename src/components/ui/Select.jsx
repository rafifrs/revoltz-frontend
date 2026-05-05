import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  {
    options = [],
    placeholder = 'Select an option',
    error,
    disabled = false,
    size = 'md',
    id,
    'aria-describedby': ariaDescribedby,
    className = '',
    ...rest
  },
  ref
) {
  const sizeStyles = {
    sm: 'px-2 py-1.5 text-sm',
    md: 'px-3 py-3 text-base',
    lg: 'px-4 py-4 text-lg',
  };

  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={ariaDescribedby}
        className={[
          'w-full appearance-none border rounded-lg outline-none transition-all duration-200 pr-10',
          sizeStyles[size] ?? sizeStyles.md,
          error
            ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
            : 'border-[#AAAAAA] bg-white focus:border-deep-blue focus:ring-2 focus:ring-blue-100',
          disabled ? 'bg-light-gray cursor-not-allowed opacity-60' : 'cursor-pointer',
          className,
        ].join(' ')}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]"
        aria-hidden="true"
      />
    </div>
  );
});

export default Select;
