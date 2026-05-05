import Spinner from './Spinner';

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  children,
  className = '',
  ...rest
}) {
  const variantStyles = {
    primary: 'bg-bright-green text-white hover:opacity-90 active:scale-[0.98]',
    secondary: 'border-2 border-deep-blue text-deep-blue bg-transparent hover:bg-light-gray active:scale-[0.98]',
    danger: 'bg-red-500 text-white hover:opacity-90 active:scale-[0.98]',
    ghost: 'text-deep-blue bg-transparent hover:bg-light-gray active:scale-[0.98]',
  };

  const sizeStyles = {
    sm: 'h-8 px-3 text-sm gap-1.5',
    md: 'h-10 px-6 text-base gap-2',
    lg: 'h-12 px-8 text-lg gap-2',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={[
        'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200',
        variantStyles[variant] ?? variantStyles.primary,
        sizeStyles[size] ?? sizeStyles.md,
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className,
      ].join(' ')}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...rest}
    >
      {loading ? <Spinner size="sm" color={variant === 'secondary' ? 'deep-blue' : 'white'} /> : children}
    </button>
  );
}

export default Button;
