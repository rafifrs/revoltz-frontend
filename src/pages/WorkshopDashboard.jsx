import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Boxes, Cpu, ScanSearch } from 'lucide-react';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import DashboardOverview from '../components/specialty/DashboardOverview';
import BatteryTable from '../components/specialty/BatteryTable';
import WorkshopHeader from '../components/layout/WorkshopHeader';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import api from '../utils/api';

function WorkshopDashboard() {
  const { user } = useAuth();
  const { showToast }    = useToast();
  const navigate         = useNavigate();

  const [stats,            setStats]           = useState(null);
  const [recentBatteries,  setRecentBatteries] = useState([]);
  const [loading,          setLoading]         = useState(true);
  const [error,            setError]           = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, inventoryRes] = await Promise.all([
        api.get('/workshop/stats'),
        api.get('/inventory'),
      ]);
      setStats(statsRes.data);
      setRecentBatteries((inventoryRes.data.batteries ?? []).slice(0, 5));
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to load dashboard data.';
      setError(msg);
      showToast({ message: msg, type: 'error', duration: 6000 });
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchAll(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchAll]);

  return (
    <div className="min-h-screen bg-light-gray">
      <WorkshopHeader />

      <main className="max-w-6xl mx-auto p-6 space-y-6">

        {/* Page title */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-deep-blue">
              Welcome, {user?.full_name ?? 'Workshop'}!
            </h1>
            {user?.workshop_name && (
              <p className="text-sm text-dark-gray mt-0.5">{user.workshop_name}</p>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <Alert
            type="error"
            title="Failed to load dashboard"
            message={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}
        {error && (
          <Button variant="secondary" size="sm" onClick={fetchAll}>
            Retry
          </Button>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold">Loading dashboard…</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Stats overview */}
            <DashboardOverview stats={stats} />

            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6">
              <Card variant="default" padding="lg" className="border border-[#D7D7D7]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-bright-green mb-4">Workshop Scan Flow</p>
                <h2 className="text-2xl font-bold text-deep-blue mb-3">Two analysis levels, one workflow.</h2>
                <p className="text-sm text-dark-gray leading-relaxed max-w-2xl mb-6">
                  Start with a pack-level scan to estimate battery health using Model 1. If the pack looks promising, continue to cell-level analysis with Model 2 to check compatibility and repack recommendations.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-[20px] bg-light-gray p-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                      <ScanSearch size={20} className="text-white" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-2">Level 1</p>
                    <h3 className="text-lg font-bold text-deep-blue mb-2">Pack-Level Scan</h3>
                    <p className="text-sm text-dark-gray leading-relaxed">
                      Input pack voltage, capacity, cycle count, and temperature to get SoH, confidence, and recommended next action.
                    </p>
                  </div>
                  <div className="rounded-[20px] bg-light-gray p-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                      <Cpu size={20} className="text-white" aria-hidden="true" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-2">Level 2</p>
                    <h3 className="text-lg font-bold text-deep-blue mb-2">Cell-Level Scan</h3>
                    <p className="text-sm text-dark-gray leading-relaxed">
                      Continue with cell OCV and IR values to identify outliers, compatible cells, and recommended pack assemblies.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="default" padding="lg" className="border border-[#D7D7D7]">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-bright-green mb-2">Inventory Status</p>
                    <h2 className="text-xl font-bold text-deep-blue">What to review next</h2>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                    <Boxes size={20} className="text-deep-blue" aria-hidden="true" />
                  </div>
                </div>
                <div className="space-y-4">
                  {recentBatteries.slice(0, 3).map((battery) => (
                    <button
                      key={battery.id}
                      type="button"
                      onClick={() => navigate(`/inventory/${battery.id}`, { state: { battery } })}
                      className="w-full text-left rounded-[18px] border border-[#D7D7D7] p-4 hover:border-deep-blue hover:bg-light-gray transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-sm font-semibold text-deep-blue">{battery.id}</p>
                          <p className="text-xs text-dark-gray mt-1">
                            {battery.chemistry} · SoH {Math.round((battery.soh ?? 0) * 100)}% · {battery.recommended_action}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-[#7A7A7A] shrink-0 mt-1" aria-hidden="true" />
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Recent batteries */}
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-base font-bold text-deep-blue">Recent Batteries</h2>
                <button
                  onClick={() => navigate('/inventory')}
                  className="text-sm text-bright-green font-semibold hover:underline transition-colors"
                >
                  View all →
                </button>
              </div>
              <BatteryTable
                batteries={recentBatteries}
                onRowClick={(id) => navigate(`/inventory/${id}`)}
                filterable={false}
              />
            </Card>
          </>
        )}
      </main>
    </div>
  );
}

export default WorkshopDashboard;
