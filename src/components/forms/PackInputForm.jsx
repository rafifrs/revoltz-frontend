import { useState } from 'react';
import { ArrowRight, BatteryMedium, Cpu, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import FormInput from './FormInput';
import FormSelect from './FormSelect';

const CONDITION_OPTIONS = [
  { value: 'normal',   label: 'Normal'   },
  { value: 'dented',   label: 'Dented'   },
  { value: 'swollen',  label: 'Swollen'  },
  { value: 'leaking',  label: 'Leaking'  },
];

const CHEMISTRY_OPTIONS = [
  { value: 'NMC', label: 'NMC (Nickel Manganese Cobalt)' },
  { value: 'LFP', label: 'LFP (Lithium Iron Phosphate)'  },
  { value: 'LCO', label: 'LCO (Lithium Cobalt Oxide)'    },
];

const SOURCE_OPTIONS = [
  { id: 'trade_in',   label: 'Customer trade-in' },
  { id: 'inventory',  label: 'From inventory'    },
  { id: 'repair',     label: 'From repair'       },
];

const INITIAL_FORM = {
  ocv_v: '', capacity_ah: '', cycle_count: '', temperature_c: '',
  condition: 'normal', chemistry: 'NMC', age_days: '',
  source: 'trade_in',
};

function validate(form) {
  const errors = {};

  const ocv = parseFloat(form.ocv_v);
  if (form.ocv_v === '')         errors.ocv_v = 'OCV is required';
  else if (isNaN(ocv) || ocv <= 0 || ocv > 5)
    errors.ocv_v = 'OCV must be between 0 and 5 V';

  const cap = parseFloat(form.capacity_ah);
  if (form.capacity_ah === '')   errors.capacity_ah = 'Capacity is required';
  else if (isNaN(cap) || cap <= 0 || cap > 1000)
    errors.capacity_ah = 'Capacity must be between 0 and 1000 Ah';

  const cycles = parseInt(form.cycle_count, 10);
  if (form.cycle_count === '')   errors.cycle_count = 'Cycle count is required';
  else if (isNaN(cycles) || cycles < 0)
    errors.cycle_count = 'Cycle count must be ≥ 0';

  const temp = parseFloat(form.temperature_c);
  if (form.temperature_c === '') errors.temperature_c = 'Temperature is required';
  else if (isNaN(temp) || temp < -20 || temp > 60)
    errors.temperature_c = 'Temperature must be between −20 and 60 °C';

  if (form.age_days !== '') {
    const age = parseFloat(form.age_days);
    if (isNaN(age) || age < 0) errors.age_days = 'Age must be ≥ 0 days';
  }

  return errors;
}

function PackInputForm({ onSubmit, isLoading = false, onCancel }) {
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Focus first invalid field
      const firstKey = Object.keys(validationErrors)[0];
      document.getElementById(`input-${firstKey}`)?.focus();
      return;
    }

    const payload = {
      pack_id:       `pack_${Date.now()}`,
      ocv_v:         parseFloat(form.ocv_v),
      capacity_ah:   parseFloat(form.capacity_ah),
      cycle_count:   parseInt(form.cycle_count, 10),
      temperature_c: parseFloat(form.temperature_c),
      chemistry:     form.chemistry,
      source:        form.source,
      condition:     form.condition,
    };
    if (form.age_days !== '') payload.age_days = parseFloat(form.age_days);

    onSubmit(payload);
  };

  return (
    <Card variant="default" padding="lg" className="border border-[#D7D7D7] overflow-hidden">
      <div className="rounded-[22px] p-6 text-white mb-6"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 mb-4">
              <Cpu size={14} aria-hidden="true" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Model 1</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Pack-Level Battery Analysis</h2>
            <p className="text-sm text-white/82 max-w-2xl leading-relaxed">
              Enter the core pack measurements once. ReVoltz will estimate SoH, confidence, and the recommended next step before you decide whether a deeper cell scan is needed.
            </p>
          </div>
          <div className="rounded-[20px] bg-black/10 border border-white/15 p-4 min-w-[220px]">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-soft-mint mb-2">Flow</p>
            <div className="flex items-center gap-2 text-sm">
              <BatteryMedium size={16} aria-hidden="true" />
              <span>Pack data</span>
              <ArrowRight size={14} aria-hidden="true" />
              <span>Model 1</span>
              <ArrowRight size={14} aria-hidden="true" />
              <span>Decision</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <fieldset className="mb-6">
          <legend className="text-sm font-semibold text-deep-blue mb-3">Battery source</legend>
          <div className="grid sm:grid-cols-3 gap-3">
            {SOURCE_OPTIONS.map(({ id, label }) => (
              <label
                key={id}
                className={[
                  'rounded-[18px] border px-4 py-3 cursor-pointer select-none transition-colors',
                  form.source === id
                    ? 'border-deep-blue bg-soft-mint/30'
                    : 'border-[#D7D7D7] bg-white hover:border-deep-blue',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="source"
                  value={id}
                  checked={form.source === id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-sm font-semibold text-[#222222]">{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-[22px] bg-light-gray p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-bright-green" aria-hidden="true" />
            <p className="text-sm font-semibold text-deep-blue">
              Required Measurements <span className="text-red-500">*</span>
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
            <FormInput
              label="OCV (Volts)"
              name="ocv_v"
              type="number"
              value={form.ocv_v}
              onChange={handleChange}
              error={errors.ocv_v}
              placeholder="e.g. 3.7"
              helperText="Open-circuit voltage (0 – 5 V)"
              step="0.01"
              min="0"
              max="5"
              required
            />
            <FormInput
              label="Capacity (Ah)"
              name="capacity_ah"
              type="number"
              value={form.capacity_ah}
              onChange={handleChange}
              error={errors.capacity_ah}
              placeholder="e.g. 20"
              helperText="Pack capacity in Amp-hours"
              step="0.1"
              min="0"
              max="1000"
              required
            />
            <FormInput
              label="Cycle Count"
              name="cycle_count"
              type="number"
              value={form.cycle_count}
              onChange={handleChange}
              error={errors.cycle_count}
              placeholder="e.g. 500"
              helperText="Total charge / discharge cycles"
              min="0"
              required
            />
            <FormInput
              label="Temperature (°C)"
              name="temperature_c"
              type="number"
              value={form.temperature_c}
              onChange={handleChange}
              error={errors.temperature_c}
              placeholder="e.g. 25"
              helperText="Operating temperature (−20 to 60 °C)"
              step="0.1"
              min="-20"
              max="60"
              required
            />
          </div>
        </div>

        <div className="rounded-[22px] bg-white border border-[#D7D7D7] p-5">
          <p className="text-sm font-semibold text-dark-gray mb-4">
            Additional Context <span className="font-normal text-[#AAAAAA]">(optional)</span>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5">
          <FormSelect
            label="Physical Condition"
            name="condition"
            value={form.condition}
            onChange={handleChange}
            options={CONDITION_OPTIONS}
          />
          <FormSelect
            label="Chemistry"
            name="chemistry"
            value={form.chemistry}
            onChange={handleChange}
            options={CHEMISTRY_OPTIONS}
          />
          <FormInput
            label="Age (days)"
            name="age_days"
            type="number"
            value={form.age_days}
            onChange={handleChange}
            error={errors.age_days}
            placeholder="e.g. 600"
            helperText="Estimated battery age"
            min="0"
          />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-light-gray mt-6">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" loading={isLoading} className="sm:ml-auto sm:min-w-44">
            {isLoading ? 'Analyzing…' : 'Analyze Battery'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default PackInputForm;
