import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import BatteryTable from '../components/specialty/BatteryTable';
import WorkshopHeader from '../components/layout/WorkshopHeader';
import { useToast } from '../hooks/useToast';
import api from '../utils/api';

const STATUS_OPTIONS = [
  { value: '',         label: 'All Status' },
  { value: 'active',   label: 'Active' },
  { value: 'sold',     label: 'Sold' },
  { value: 'archived', label: 'Archived' },
  { value: 'recycled', label: 'Recycled' },
];

function InventoryPage() {
  const navigate      = useNavigate();
  const { showToast } = useToast();

  const [batteries,    setBatteries]    = useState([]);
  const [searchId,     setSearchId]     = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/inventory');
      setBatteries(res.data.batteries ?? []);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load inventory.';
      setError(msg);
      showToast({ message: msg, type: 'error', duration: 6000 });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchInventory(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchInventory]);

  const filteredBatteries = useMemo(() =>
    batteries.filter((b) =>
      b.id.toLowerCase().includes(searchId.toLowerCase()) &&
      (!filterStatus || b.status === filterStatus)
    ),
    [batteries, searchId, filterStatus]
  );

  const handleExportCSV = () => {
    const header = 'ID,Chemistry,SoH %,Status,Action,Last Updated';
    const rows = filteredBatteries.map((b) =>
      `${b.id},${b.chemistry},${Math.round(b.soh * 100)},${b.status},${b.recommended_action},${b.last_updated}`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'revoltz_inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast({ message: 'CSV exported!', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <WorkshopHeader />

      <main className="max-w-6xl mx-auto p-6 space-y-5">

        {/* Page header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-deep-blue">Battery Inventory</h1>
            <p className="text-sm text-dark-gray mt-0.5">
              {loading ? '—' : `${filteredBatteries.length} of ${batteries.length}`} batteries
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleExportCSV} disabled={loading || filteredBatteries.length === 0}>
            <Download size={15} className="mr-1" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by ID…"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="border border-[#AAAAAA] rounded-lg px-3 py-2 text-sm outline-none focus:border-deep-blue focus:ring-2 focus:ring-blue-100 w-48"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-[#AAAAAA] rounded-lg px-3 py-2 text-sm outline-none focus:border-deep-blue focus:ring-2 focus:ring-blue-100 bg-white"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {(searchId || filterStatus) && (
            <button
              onClick={() => { setSearchId(''); setFilterStatus(''); }}
              className="text-sm text-[#AAAAAA] hover:text-deep-blue font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <>
            <Alert type="error" title="Failed to load" message={error} dismissible onDismiss={() => setError(null)} />
            <Button variant="secondary" size="sm" onClick={fetchInventory}>Retry</Button>
          </>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold">Loading inventory…</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <BatteryTable
            batteries={filteredBatteries}
            onRowClick={(id) => navigate(`/inventory/${id}`, { state: { battery: filteredBatteries.find((bat) => bat.id === id) } })}
            sortable
            filterable={false}
          />
        )}
      </main>
    </div>
  );
}

export default InventoryPage;
