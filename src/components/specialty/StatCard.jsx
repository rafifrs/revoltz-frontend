import Card from '../ui/Card';

const VARIANT_STYLES = {
  default: '',
  success: 'bg-bright-green bg-opacity-10 border-bright-green border-opacity-30',
  warning: 'bg-lime-green bg-opacity-10 border-lime-green border-opacity-30',
};

function StatCard({ label, value, unit = '', trend = null, icon: Icon, variant = 'default' }) {
  return (
    <div
      className={[
        'rounded-[20px] p-6 border flex flex-col gap-3',
        variant === 'default' ? 'bg-white border-[#AAAAAA] shadow-sm' : VARIANT_STYLES[variant],
      ].join(' ')}
    >
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center shrink-0">
          <Icon size={20} className="text-deep-blue" aria-hidden="true" />
        </div>
      )}
      <div>
        <p className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-deep-blue mt-1">
          {value}
          {unit && <span className="text-base font-semibold text-dark-gray ml-1">{unit}</span>}
        </p>
      </div>
      {trend !== null && (
        <p className="text-xs font-semibold text-bright-green flex items-center gap-0.5">
          ↑ {trend > 0 ? '+' : ''}{trend}% vs last month
        </p>
      )}
    </div>
  );
}

export default StatCard;
