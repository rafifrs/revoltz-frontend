function Card({
  variant = 'default',
  padding = 'md',
  clickable = false,
  children,
  className = '',
  ...rest
}) {
  const variantStyles = {
    default: 'bg-white shadow-sm',
    outlined: 'bg-white border border-[#AAAAAA]',
    elevated: 'bg-white shadow-lg',
  };

  const paddingStyles = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={[
        'rounded-20',
        variantStyles[variant] ?? variantStyles.default,
        paddingStyles[padding] ?? paddingStyles.md,
        clickable
          ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200'
          : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
