import { useState } from 'react';
import { ArrowRight, Boxes, Plus, Sparkles, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const CHEMISTRY_OPTIONS = [
  { value: '', label: 'Unknown / Auto-detect' },
  { value: 'LFP', label: 'LFP (Lithium Iron Phosphate)' },
  { value: 'NMC', label: 'NMC (Lithium Nickel Manganese Cobalt)' },
  { value: 'NCA', label: 'NCA (Lithium Nickel Cobalt Aluminium)' },
  { value: 'LCO', label: 'LCO (Lithium Cobalt Oxide)' },
];

function makeRow() {
  return { _key: crypto.randomUUID(), cell_id: '', IR_mohm: '', OCV_V: '' };
}

function CellInputForm({ onSubmit, isLoading, initialPackResult }) {
  const [rows, setRows] = useState([makeRow()]);
  const [assemblyConfig, setAssemblyConfig] = useState({
    target_pack_size: '4',
    max_packs: '',
    allow_partial_packs: true,
  });
  const [chemistry, setChemistry] = useState('');
  const [errors, setErrors] = useState({});

  const updateRow = (key, field, value) => {
    setRows((prev) => prev.map((r) => (r._key === key ? { ...r, [field]: value } : r)));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${key}_${field}`];
      return next;
    });
  };

  const addRow = () => setRows((prev) => [...prev, makeRow()]);

  const removeRow = (key) => {
    if (rows.length === 1) return;
    setRows((prev) => prev.filter((r) => r._key !== key));
  };

  const validate = () => {
    const errs = {};
    const seenIds = new Set();

    rows.forEach((row) => {
      if (!row.cell_id.trim()) {
        errs[`${row._key}_cell_id`] = 'Cell ID is required.';
      } else if (seenIds.has(row.cell_id.trim())) {
        errs[`${row._key}_cell_id`] = 'Duplicate Cell ID.';
      } else {
        seenIds.add(row.cell_id.trim());
      }

      const ir = parseFloat(row.IR_mohm);
      if (!row.IR_mohm) {
        errs[`${row._key}_IR_mohm`] = 'Internal resistance is required.';
      } else if (isNaN(ir) || ir <= 0) {
        errs[`${row._key}_IR_mohm`] = 'Must be a positive number.';
      } else if (ir > 10000) {
        errs[`${row._key}_IR_mohm`] = 'Value seems too high (max 10 000 mΩ).';
      }

      const ocv = parseFloat(row.OCV_V);
      if (!row.OCV_V) {
        errs[`${row._key}_OCV_V`] = 'OCV is required.';
      } else if (isNaN(ocv) || ocv <= 0) {
        errs[`${row._key}_OCV_V`] = 'Must be a positive number.';
      } else if (ocv > 5) {
        errs[`${row._key}_OCV_V`] = 'OCV must be ≤ 5 V.';
      }
    });

    const ps = parseInt(assemblyConfig.target_pack_size, 10);
    if (!assemblyConfig.target_pack_size || isNaN(ps) || ps < 2 || ps > 512) {
      errs['target_pack_size'] = 'Pack size must be between 2 and 512.';
    }

    if (assemblyConfig.max_packs) {
      const mp = parseInt(assemblyConfig.max_packs, 10);
      if (isNaN(mp) || mp < 1 || mp > 100) {
        errs['max_packs'] = 'Max packs must be between 1 and 100.';
      }
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      setTimeout(() => {
        const el = document.getElementById(`input-${firstKey}`);
        el?.focus();
      }, 50);
      return;
    }

    const cells = rows.map((row) => ({
      cell_id: row.cell_id.trim(),
      IR_ohm: parseFloat(row.IR_mohm) / 1000,
      OCV_V: parseFloat(row.OCV_V),
      ...(chemistry ? { chemistry } : {}),
    }));

    const assembly_request = {
      target_pack_size: parseInt(assemblyConfig.target_pack_size, 10),
      allow_partial_packs: assemblyConfig.allow_partial_packs,
      ...(assemblyConfig.max_packs
        ? { max_packs: parseInt(assemblyConfig.max_packs, 10) }
        : {}),
    };

    onSubmit({ cells, assembly_request });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>

      {initialPackResult && (
        <div className="mb-6 rounded-[22px] p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-soft-mint mb-2">Model 2</p>
              <h3 className="text-xl font-bold mb-2">Cell Compatibility Analysis</h3>
              <p className="text-sm text-white/82 leading-relaxed">
                You&apos;re now analyzing cells from <span className="font-mono text-white">{initialPackResult.pack_id}</span>. This second scan level helps determine which cells belong together for repack decisions.
              </p>
            </div>
            <div className="rounded-[18px] border border-white/15 bg-black/10 px-4 py-3 text-sm">
              <p className="font-semibold">Pack SoH {(initialPackResult.predicted_soh * 100).toFixed(1)}%</p>
              <p className="text-white/75 mt-1">{initialPackResult.recommended_action}</p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[22px] bg-light-gray p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-bright-green" aria-hidden="true" />
          <p className="text-sm font-semibold text-deep-blue">Cell Context</p>
        </div>
        <FormSelect
          label="Cell Chemistry (optional — applies to all cells)"
          name="chemistry"
          value={chemistry}
          onChange={(e) => setChemistry(e.target.value)}
          options={CHEMISTRY_OPTIONS}
        />
      </div>

      <div className="rounded-[22px] bg-white border border-[#D7D7D7] p-5 mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-sm font-semibold text-deep-blue">Cell Measurements</p>
            <p className="text-xs text-dark-gray mt-1">Add OCV and internal resistance for each cell you want to compare.</p>
          </div>
          <div className="rounded-full bg-light-gray px-4 py-2 text-xs font-semibold text-dark-gray">
            {rows.length} cell{rows.length !== 1 ? 's' : ''} ready
          </div>
        </div>

        <div className="space-y-3">
        <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 px-1">
          <span className="text-xs font-semibold text-deep-blue uppercase tracking-wide">Cell ID</span>
          <span className="text-xs font-semibold text-deep-blue uppercase tracking-wide">IR (mΩ)</span>
          <span className="text-xs font-semibold text-deep-blue uppercase tracking-wide">OCV (V)</span>
          <span />
        </div>

        {rows.map((row, idx) => (
          <div key={row._key} className="sm:grid sm:grid-cols-[2fr_1fr_1fr_auto] gap-3 items-start">
            <FormInput
              label={idx === 0 ? undefined : undefined}
              name={`${row._key}_cell_id`}
              placeholder={`CELL-${String(idx + 1).padStart(3, '0')}`}
              value={row.cell_id}
              onChange={(e) => updateRow(row._key, 'cell_id', e.target.value)}
              error={errors[`${row._key}_cell_id`]}
              aria-label={`Cell ID for row ${idx + 1}`}
            />
            <FormInput
              name={`${row._key}_IR_mohm`}
              type="number"
              placeholder="e.g. 25"
              min="0.001"
              step="0.001"
              value={row.IR_mohm}
              onChange={(e) => updateRow(row._key, 'IR_mohm', e.target.value)}
              error={errors[`${row._key}_IR_mohm`]}
              aria-label={`Internal resistance (mΩ) for row ${idx + 1}`}
            />
            <FormInput
              name={`${row._key}_OCV_V`}
              type="number"
              placeholder="e.g. 3.65"
              min="0.001"
              max="5"
              step="0.001"
              value={row.OCV_V}
              onChange={(e) => updateRow(row._key, 'OCV_V', e.target.value)}
              error={errors[`${row._key}_OCV_V`]}
              aria-label={`OCV (V) for row ${idx + 1}`}
            />
            <div className="flex items-start pt-1 sm:pt-0">
              <button
                type="button"
                onClick={() => removeRow(row._key)}
                disabled={rows.length === 1}
                aria-label={`Remove row ${idx + 1}`}
                className="mt-1 p-2 rounded-lg text-[#AAAAAA] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addRow}
          className="mt-4"
        >
          <Plus size={16} className="mr-1" />
          Add Cell
        </Button>
      </div>

      <div className="rounded-[22px] bg-light-gray p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Boxes size={16} className="text-deep-blue" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-deep-blue">Pack Assembly Config</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">
          <FormInput
            label="Target Pack Size"
            name="target_pack_size"
            type="number"
            min="2"
            max="512"
            value={assemblyConfig.target_pack_size}
            onChange={(e) => {
              setAssemblyConfig((p) => ({ ...p, target_pack_size: e.target.value }));
              setErrors((p) => { const n = { ...p }; delete n['target_pack_size']; return n; });
            }}
            error={errors['target_pack_size']}
            helperText="Number of cells per pack (2–512)"
            required
          />
          <FormInput
            label="Max Packs (optional)"
            name="max_packs"
            type="number"
            min="1"
            max="100"
            value={assemblyConfig.max_packs}
            onChange={(e) => {
              setAssemblyConfig((p) => ({ ...p, max_packs: e.target.value }));
              setErrors((p) => { const n = { ...p }; delete n['max_packs']; return n; });
            }}
            error={errors['max_packs']}
            helperText="Leave blank for no limit"
          />
        </div>
        <label className="flex items-center gap-2.5 text-sm text-[#222222] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={assemblyConfig.allow_partial_packs}
            onChange={(e) =>
              setAssemblyConfig((p) => ({ ...p, allow_partial_packs: e.target.checked }))
            }
            className="w-4 h-4 accent-[#44CE7F] rounded"
          />
          Allow partial packs (return incomplete groups when a full pack can't be formed)
        </label>
      </div>

      <div className="flex gap-3 flex-wrap pt-2 border-t border-light-gray">
        <Button type="submit" variant="primary" size="md" loading={isLoading} disabled={isLoading}>
          Analyze {rows.length} Cell{rows.length !== 1 ? 's' : ''}
          {!isLoading && <ArrowRight size={16} className="ml-1" aria-hidden="true" />}
        </Button>
      </div>
    </form>
  );
}

export default CellInputForm;
