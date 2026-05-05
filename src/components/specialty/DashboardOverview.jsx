import { Battery, Gauge, DollarSign, Leaf } from 'lucide-react';
import StatCard from './StatCard';
import ProgressBar from '../ui/ProgressBar';

function DashboardOverview({ stats }) {
  if (!stats) return null;

  const sohPct    = Math.round(stats.average_soh * 100);
  const revenueM  = (stats.monthly_revenue / 1_000_000).toFixed(2);
  const sohColor  = sohPct >= 80 ? 'bright-green' : sohPct >= 60 ? 'lime-green' : 'red';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Batteries"
        value={stats.total_batteries}
        icon={Battery}
        variant="default"
      />

      <div className="rounded-[20px] p-6 border bg-white border-[#AAAAAA] shadow-sm flex flex-col gap-3">
        <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center shrink-0">
          <Gauge size={20} className="text-deep-blue" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#AAAAAA] uppercase tracking-wide">Average SoH</p>
          <p className="text-2xl font-bold text-deep-blue mt-1">{sohPct}%</p>
        </div>
        <ProgressBar value={sohPct} max={100} color={sohColor} />
      </div>

      <StatCard
        label="Monthly Revenue"
        value={`Rp ${revenueM}M`}
        icon={DollarSign}
        trend={8}
        variant="success"
      />

      <StatCard
        label="CO₂ Saved"
        value={stats.co2_saved}
        unit="kg"
        icon={Leaf}
        variant="warning"
      />
    </div>
  );
}

export default DashboardOverview;
