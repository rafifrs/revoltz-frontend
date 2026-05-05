import { ArrowLeft, ChevronRight, Zap } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';

/* ── helpers ─────────────────────────────────────────────── */

function getSoHMeta(soh) {
  if (soh >= 0.80) return { label: 'Excellent', barColor: 'bright-green', textClass: 'text-bright-green', badgeVariant: 'success' };
  if (soh >= 0.60) return { label: 'Good',      barColor: 'bright-green', textClass: 'text-bright-green', badgeVariant: 'success' };
  if (soh >= 0.40) return { label: 'Fair',      barColor: 'lime-green',   textClass: 'text-lime-green',   badgeVariant: 'warning' };
  return              { label: 'Poor',      barColor: 'red',          textClass: 'text-red-500',      badgeVariant: 'danger'  };
}

const ACTION_MAP = {
  recondition: { variant: 'success', label: 'Recondition' },
  repack:      { variant: 'info',    label: 'Repack'      },
  recycle:     { variant: 'danger',  label: 'Recycle'    },
};

function getPriceRange(soh) {
  if (soh >= 0.80) return 'Rp 3.0 – 4.5 Juta';
  if (soh >= 0.60) return 'Rp 1.5 – 3.0 Juta';
  if (soh >= 0.40) return 'Rp 0.5 – 1.5 Juta';
  return 'Rp 0 – 0.5 Juta';
}

function getUseCases(soh) {
  if (soh >= 0.80) return ['EV replacement battery', 'High-performance grid storage'];
  if (soh >= 0.60) return ['Backup power systems', 'Solar energy storage (24 h+)'];
  if (soh >= 0.40) return ['Street lighting systems', 'Low-power IoT / telecom'];
  return ['End-of-life — recycling recommended'];
}

/* ── component ───────────────────────────────────────────── */

function PackResultCard({ data, onBack, onAnalyzeFurther }) {
  const soh        = data?.predicted_soh    ?? 0;
  const confidence = data?.confidence_score ?? 0;
  const action     = data?.recommended_action ?? 'unknown';
  const notes      = Array.isArray(data?.notes) ? data.notes : [];

  const sohPct        = Math.round(soh * 100);
  const confidencePct = Math.round(confidence * 100);
  const sohmeta       = getSoHMeta(soh);
  const actionInfo    = ACTION_MAP[action] ?? { variant: 'default', label: action };
  const priceRange    = getPriceRange(soh);
  const useCases      = getUseCases(soh);

  return (
    <Card variant="elevated" padding="lg">
      {/* Title */}
      <div className="flex items-center gap-2 mb-6">
        <Zap size={20} className="text-bright-green" aria-hidden="true" />
        <h2 className="text-2xl font-bold text-deep-blue">Battery Health Report</h2>
      </div>

      {/* SoH hero metric */}
      <div className="mb-6">
        <div className="flex items-end gap-3 mb-3">
          <span className={`text-6xl font-bold leading-none ${sohmeta.textClass}`}>
            {sohPct}%
          </span>
          <div className="pb-1 flex flex-col gap-1">
            <p className="text-sm text-dark-gray font-medium">State of Health</p>
            <Badge variant={sohmeta.badgeVariant}>{sohmeta.label}</Badge>
          </div>
        </div>
        <ProgressBar value={sohPct} max={100} color={sohmeta.barColor} animated />
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-light-gray rounded-xl p-4">
          <p className="text-xs text-dark-gray font-semibold uppercase tracking-wide mb-1">AI Confidence</p>
          <p className="text-3xl font-bold text-deep-blue">{confidencePct}%</p>
        </div>
        <div className="bg-light-gray rounded-xl p-4">
          <p className="text-xs text-dark-gray font-semibold uppercase tracking-wide mb-1">Est. Value</p>
          <p className="text-base font-bold text-deep-blue leading-snug">{priceRange}</p>
        </div>
      </div>

      {/* Recommended action */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-dark-gray uppercase tracking-wide mb-2">Recommended Action</p>
        <Badge variant={actionInfo.variant} size="md">{actionInfo.label}</Badge>
      </div>

      {/* Use cases */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-dark-gray uppercase tracking-wide mb-2">Best Use Cases</p>
        <ul className="space-y-1.5">
          {useCases.map((uc, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-[#222222]">
              <span className="w-1.5 h-1.5 rounded-full bg-bright-green shrink-0" aria-hidden="true" />
              {uc}
            </li>
          ))}
        </ul>
      </div>

      {/* Model notes */}
      {notes.length > 0 && (
        <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-semibold text-deep-blue uppercase tracking-wide mb-2">AI Analysis Notes</p>
          <ul className="space-y-1.5">
            {notes.map((note, i) => (
              <li key={i} className="text-sm text-dark-gray leading-relaxed">• {note}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap pt-2 border-t border-light-gray">
        <Button variant="secondary" onClick={onBack}>
          <ArrowLeft size={16} className="mr-1" aria-hidden="true" />
          Back
        </Button>
        {action !== 'recycle' && (
          <Button variant="primary" onClick={onAnalyzeFurther}>
            Continue to Cell-Level Scan
            <ChevronRight size={16} className="ml-1" aria-hidden="true" />
          </Button>
        )}
      </div>
    </Card>
  );
}

export default PackResultCard;
