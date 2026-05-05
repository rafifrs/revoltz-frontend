function ProgressBar({ value = 0, max = 100, color = 'bright-green', animated = true, label, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const colorMap = {
    'bright-green': 'bg-bright-green',
    'soft-mint':    'bg-soft-mint',
    'lime-green':   'bg-lime-green',
    'red':          'bg-red-500',
  };
  const barColor = colorMap[color] ?? 'bg-bright-green';

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-semibold text-dark-gray">{label}</span>
          <span className="text-xs font-bold text-deep-blue">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="w-full h-3 bg-light-gray rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full ${animated ? 'transition-[width] duration-700 ease-out' : ''}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
