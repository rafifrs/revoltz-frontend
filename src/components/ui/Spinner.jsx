function Spinner({ size = 'md', color = 'bright-green', message }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  const colorMap = {
    'bright-green': 'border-bright-green',
    'deep-blue': 'border-deep-blue',
    white: 'border-white',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${sizeMap[size]} ${colorMap[color] ?? 'border-bright-green'} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && <p className="text-sm text-dark-gray">{message}</p>}
    </div>
  );
}

export default Spinner;
