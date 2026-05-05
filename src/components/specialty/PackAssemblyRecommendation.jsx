import ProgressBar from '../ui/ProgressBar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

function PackAssemblyRecommendation({ packs }) {
  if (!packs || packs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {packs.map((pack) => {
        const isComplete = pack.status === 'complete';
        const homogeneityPct = Math.round(pack.homogeneity_score * 100);
        const homogeneityColor =
          homogeneityPct >= 80 ? 'bright-green' : homogeneityPct >= 60 ? 'lime-green' : 'red';

        return (
          <div
            key={pack.pack_id}
            className="bg-white rounded-xl border border-[#AAAAAA] p-5 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-[#AAAAAA]">{pack.pack_id}</p>
                <p className="text-base font-bold text-deep-blue mt-0.5">
                  {pack.cell_count}/{pack.target_pack_size} cells
                </p>
              </div>
              <Badge variant={isComplete ? 'success' : 'warning'} size="sm">
                {isComplete ? 'Complete' : `−${pack.missing_cells} cells`}
              </Badge>
            </div>

            {/* Homogeneity */}
            <ProgressBar
              value={homogeneityPct}
              max={100}
              color={homogeneityColor}
              label="Homogeneity"
            />

            {/* Stats grid */}
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wide">Avg IR</dt>
                <dd className="font-mono text-[#222222] mt-0.5">
                  {(pack.average_ir_ohm * 1000).toFixed(2)} mΩ
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wide">Avg OCV</dt>
                <dd className="font-mono text-[#222222] mt-0.5">{pack.average_ocv_v.toFixed(3)} V</dd>
              </div>
              <div>
                <dt className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wide">ΔIR</dt>
                <dd className="font-mono text-[#222222] mt-0.5">
                  {(pack.average_pairwise_delta_ir * 1000).toFixed(2)} mΩ
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wide">ΔOCV</dt>
                <dd className="font-mono text-[#222222] mt-0.5">
                  {pack.average_pairwise_delta_ocv.toFixed(3)} V
                </dd>
              </div>
            </dl>

            {/* Cell IDs */}
            <div>
              <p className="text-xs text-[#AAAAAA] font-semibold uppercase tracking-wide mb-1.5">
                Cells
              </p>
              <div className="flex flex-wrap gap-1">
                {pack.cell_ids.map((id) => (
                  <span
                    key={id}
                    className="font-mono text-xs bg-soft-mint bg-opacity-40 text-deep-blue px-1.5 py-0.5 rounded"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            {pack.notes && pack.notes.length > 0 && (
              <ul className="text-xs text-dark-gray space-y-0.5">
                {pack.notes.map((note, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-[#AAAAAA]">·</span>
                    {note}
                  </li>
                ))}
              </ul>
            )}

            <Button
              variant="primary"
              size="sm"
              disabled={!isComplete}
              className="mt-auto w-full"
              title={!isComplete ? 'Only complete packs can be selected' : undefined}
            >
              Use This Config
            </Button>
          </div>
        );
      })}
    </div>
  );
}

export default PackAssemblyRecommendation;
