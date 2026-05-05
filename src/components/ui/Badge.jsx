function Badge({ variant = 'default', size = 'sm', icon, children, className = '' }) {
  const variantStyles = {
    success: 'bg-bright-green text-white',
    warning: 'bg-lime-green text-white',
    danger: 'bg-red-500 text-white',
    info: 'bg-soft-mint text-deep-blue',
    default: 'bg-light-gray text-dark-gray',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-lg font-semibold',
        variantStyles[variant] ?? variantStyles.default,
        sizeStyles[size] ?? sizeStyles.sm,
        className,
      ].join(' ')}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
