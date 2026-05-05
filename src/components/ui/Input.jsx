import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    type = 'text',
    placeholder,
    error,
    disabled = false,
    size = 'md',
    className = '',
    id,
    'aria-describedby': ariaDescribedby,
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
    <input
      ref={ref}
      id={id}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={ariaDescribedby}
      className={[
        'w-full border rounded-lg outline-none transition-all duration-200',
        sizeStyles[size] ?? sizeStyles.md,
        error
          ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100'
          : 'border-[#AAAAAA] bg-white focus:border-deep-blue focus:ring-2 focus:ring-blue-100',
        disabled ? 'bg-light-gray cursor-not-allowed opacity-60' : '',
        className,
      ].join(' ')}
      {...rest}
    />
  );
});

export default Input;
