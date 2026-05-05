import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import Button from '../ui/Button';

const CHEMISTRIES = ['NMC', 'LFP', 'LCO', 'NCA'];
const SOH_RANGES  = [
  { label: '90–100%', min: 0.90, max: 1.00 },
  { label: '80–89%',  min: 0.80, max: 0.90 },
  { label: '70–79%',  min: 0.70, max: 0.80 },
  { label: '60–69%',  min: 0.60, max: 0.70 },
];

const PRICE_MAX = 100_000_000;

function fmtM(val) {
  return val >= 1_000_000 ? `${(val / 1_000_000).toFixed(0)}M` : `${(val / 1_000).toFixed(0)}K`;
}

const DEFAULT_FILTERS = {
  chemistries: [],
  sohRanges:   [],
  priceMax:    PRICE_MAX,
};

function FilterContent({ filters, setFilters, onApply, onClear }) {
  const toggleChemistry = (c) =>
    setFilters((f) => ({
      ...f,
      chemistries: f.chemistries.includes(c) ? f.chemistries.filter((x) => x !== c) : [...f.chemistries, c],
    }));

  const toggleSoh = (range) =>
    setFilters((f) => {
      const key = range.label;
      const exists = f.sohRanges.some((r) => r.label === key);
      return { ...f, sohRanges: exists ? f.sohRanges.filter((r) => r.label !== key) : [...f.sohRanges, range] };
    });

  return (
    <div className="space-y-6">
      {/* Chemistry */}
      <div>
        <p className="text-xs font-bold text-deep-blue uppercase tracking-wide mb-3">Battery Type</p>
        <div className="space-y-2">
          {CHEMISTRIES.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#222222] hover:text-deep-blue">
              <input
                type="checkbox"
                checked={filters.chemistries.includes(c)}
                onChange={() => toggleChemistry(c)}
                className="w-4 h-4 accent-[#244F93] rounded"
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* SoH */}
      <div>
        <p className="text-xs font-bold text-deep-blue uppercase tracking-wide mb-3">State of Health</p>
        <div className="space-y-2">
          {SOH_RANGES.map((range) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer text-sm text-[#222222] hover:text-deep-blue">
              <input
                type="checkbox"
                checked={filters.sohRanges.some((r) => r.label === range.label)}
                onChange={() => toggleSoh(range)}
                className="w-4 h-4 accent-[#244F93] rounded"
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="text-xs font-bold text-deep-blue uppercase tracking-wide mb-3">Price Range (Rp)</p>
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={1_000_000}
          value={filters.priceMax}
          onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
          className="w-full accent-[#44CE7F]"
        />
        <div className="flex justify-between text-xs text-dark-gray mt-1">
          <span>0</span>
          <span>Max: {fmtM(filters.priceMax)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <Button variant="primary" size="sm" className="w-full" onClick={onApply}>
          Apply Filters
        </Button>
        <button
          onClick={onClear}
          className="w-full text-sm text-dark-gray hover:text-deep-blue font-medium py-1.5 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

function MarketplaceFilter({ onFilterChange }) {
  const [filters,       setFilters]       = useState(DEFAULT_FILTERS);
  const [drawerOpen,    setDrawerOpen]    = useState(false);

  const handleApply = () => {
    onFilterChange(filters);
    setDrawerOpen(false);
  };

  const handleClear = () => {
    const reset = { ...DEFAULT_FILTERS };
    setFilters(reset);
    onFilterChange(reset);
    setDrawerOpen(false);
  };

  return (
    <>
      {/* Mobile: filter toggle button */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen((o) => !o)}
          className="flex items-center gap-2 px-4 py-2 border border-[#AAAAAA] rounded-xl text-sm font-semibold text-deep-blue hover:bg-light-gray transition-colors"
        >
          <Filter size={15} aria-hidden="true" />
          Filters
        </button>

        {drawerOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-deep-blue text-base">Filters</h2>
                <button onClick={() => setDrawerOpen(false)} className="p-1 text-dark-gray hover:text-deep-blue">
                  <X size={18} />
                </button>
              </div>
              <FilterContent filters={filters} setFilters={setFilters} onApply={handleApply} onClear={handleClear} />
            </div>
          </>
        )}
      </div>

      {/* Desktop: left sidebar */}
      <aside className="hidden lg:block w-52 shrink-0">
        <div className="bg-white rounded-[20px] border border-[#AAAAAA] p-5 sticky top-20">
          <div className="flex items-center gap-2 mb-5">
            <Filter size={14} className="text-deep-blue" aria-hidden="true" />
            <h2 className="text-sm font-bold text-deep-blue">Filters</h2>
          </div>
          <FilterContent filters={filters} setFilters={setFilters} onApply={handleApply} onClear={handleClear} />
        </div>
      </aside>
    </>
  );
}

export default MarketplaceFilter;
