import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

const STATUS_STYLES = {
  active:   'bg-green-100 text-bright-green',
  sold:     'bg-blue-100 text-deep-blue',
  archived: 'bg-gray-100 text-[#AAAAAA]',
  recycled: 'bg-red-100 text-red-600',
};

const ACTION_STYLES = {
  recondition: 'bg-green-100 text-bright-green',
  repack:      'bg-[#9BE8A8] bg-opacity-40 text-deep-blue',
  recycle:     'bg-red-100 text-red-600',
};

const COLUMNS = [
  { key: 'id',                 label: 'ID' },
  { key: 'chemistry',          label: 'Chemistry' },
  { key: 'soh',                label: 'SoH %' },
  { key: 'status',             label: 'Status' },
  { key: 'recommended_action', label: 'Action' },
  { key: 'last_updated',       label: 'Last Updated' },
];

function SortIcon({ column, sortKey, sortDir }) {
  if (sortKey !== column) return <ChevronsUpDown size={12} className="text-[#AAAAAA]" />;
  return sortDir === 'asc'
    ? <ChevronUp size={12} className="text-deep-blue" />
    : <ChevronDown size={12} className="text-deep-blue" />;
}

function BatteryTable({ batteries = [], onRowClick, sortable = true, filterable = true }) {
  const [sortKey, setSortKey]   = useState('last_updated');
  const [sortDir, setSortDir]   = useState('desc');
  const [search,  setSearch]    = useState('');

  const handleSort = (key) => {
    if (!sortable) return;
    setSortDir((d) => (sortKey === key ? (d === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortKey(key);
  };

  const displayed = useMemo(() => {
    let list = batteries.filter((b) =>
      b.id.toLowerCase().includes(search.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return list;
  }, [batteries, search, sortKey, sortDir]);

  return (
    <div className="space-y-3">
      {filterable && (
        <input
          type="text"
          placeholder="Search by ID…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 border border-[#AAAAAA] rounded-lg px-3 py-2 text-sm outline-none focus:border-deep-blue focus:ring-2 focus:ring-blue-100"
        />
      )}

      <div className="overflow-x-auto rounded-xl border border-[#AAAAAA]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-light-gray border-b border-[#AAAAAA]">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={[
                    'text-left px-4 py-3 text-xs font-semibold text-deep-blue uppercase tracking-wide whitespace-nowrap',
                    sortable ? 'cursor-pointer select-none hover:text-bright-green' : '',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortable && <SortIcon column={col.key} sortKey={sortKey} sortDir={sortDir} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-[#AAAAAA] text-sm">
                  No batteries found.
                </td>
              </tr>
            ) : (
              displayed.map((bat, idx) => (
                <tr
                  key={bat.id}
                  onClick={() => onRowClick?.(bat.id)}
                  className={[
                    'border-b border-[#AAAAAA] last:border-0 transition-colors',
                    onRowClick ? 'cursor-pointer hover:bg-soft-mint hover:bg-opacity-20' : '',
                    idx % 2 === 0 ? 'bg-white' : 'bg-light-gray',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-mono text-[#222222] font-medium whitespace-nowrap">{bat.id}</td>
                  <td className="px-4 py-3 text-[#222222]">{bat.chemistry ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold text-deep-blue whitespace-nowrap">
                    {bat.soh !== undefined ? `${Math.round(bat.soh * 100)}%` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLES[bat.status] ?? 'bg-gray-100 text-gray-600'}`}>
                      {bat.status ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${ACTION_STYLES[bat.recommended_action] ?? 'bg-gray-100 text-gray-600'}`}>
                      {bat.recommended_action ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-gray whitespace-nowrap">{bat.last_updated ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BatteryTable;
