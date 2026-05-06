import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity, ArrowLeft, BatteryMedium, Boxes, CalendarClock, CircuitBoard,
  Cpu, FlaskConical, ShieldCheck,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import ProgressBar from '../components/ui/ProgressBar';
import CellCompatibilityMatrix from '../components/specialty/CellCompatibilityMatrix';
import PackAssemblyRecommendation from '../components/specialty/PackAssemblyRecommendation';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function statusStyles(status) {
  const map = {
    active: 'bg-green-100 text-bright-green',
    sold: 'bg-blue-100 text-deep-blue',
    archived: 'bg-gray-100 text-[#7A7A7A]',
    recycled: 'bg-red-100 text-red-600',
  };
  return map[status] ?? 'bg-gray-100 text-[#7A7A7A]';
}

function actionStyles(action) {
  const map = {
    recondition: 'bg-green-100 text-bright-green',
    repack: 'bg-[#DFF7E4] text-deep-blue',
    recycle: 'bg-red-100 text-red-600',
  };
  return map[action] ?? 'bg-gray-100 text-[#7A7A7A]';
}

function sohColor(soh) {
  if (soh >= 0.8) return 'bright-green';
  if (soh >= 0.6) return 'soft-mint';
  if (soh >= 0.4) return 'lime-green';
  return 'red';
}

function fmtPercent(value) {
  if (value === null || value === undefined) return '—';
  return `${Math.round(value * 100)}%`;
}

function fmtPrice(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function OverviewMetric({ icon: Icon, label, value, subtext }) {
  return (
    <div className="rounded-[20px] border border-[#D7D7D7] bg-white p-5 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center mb-3">
        <Icon size={18} className="text-deep-blue" aria-hidden="true" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">{label}</p>
      <p className="text-2xl font-bold text-deep-blue">{value}</p>
      {subtext && <p className="text-sm text-dark-gray mt-1">{subtext}</p>}
    </div>
  );
}

function SpecItem({ label, value }) {
  return (
    <div className="rounded-[18px] bg-light-gray p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">{label}</p>
      <p className="text-sm font-bold text-deep-blue break-words">{value ?? '—'}</p>
    </div>
  );
}

function PublicBatteryProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBattery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/battery-profiles/${id}`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setBattery(data.battery);
    } catch (err) {
      setError(err.message || 'Failed to load battery profile.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = setTimeout(() => { fetchBattery(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchBattery]);

  const packAnalysis = useMemo(() => {
    if (!battery) return null;
    return battery.pack_analysis ?? {
      pack_id: battery.pack_id,
      predicted_soh: battery.soh,
      confidence_score: battery.confidence_score,
      recommended_action: battery.recommended_action,
      notes: [],
    };
  }, [battery]);

  const cellAnalysis = battery?.cell_analysis ?? null;
  const repackRate = cellAnalysis?.summary?.repack_rate ?? 0;

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <Header />

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-dark-gray hover:text-deep-blue transition-colors mb-3"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-deep-blue">Battery QR Profile</h1>
            <p className="text-sm text-dark-gray mt-1">
              Public battery record for packaging, handling, and operational verification.
            </p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold">Loading battery profile…</p>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-3">
            <Alert type="error" title="Failed to load battery profile" message={error} />
            <button type="button" onClick={fetchBattery} className="text-sm font-semibold text-bright-green hover:underline">
              Retry
            </button>
          </div>
        )}

        {!loading && !error && battery && (
          <>
            <section
              className="rounded-[28px] p-8 text-white overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
            >
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-soft-mint mb-4">Battery Packaging Profile</p>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
                      <BatteryMedium size={14} aria-hidden="true" />
                      {battery.chemistry ?? 'Unknown chemistry'}
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusStyles(battery.status)} bg-white/95`}>
                      {battery.status}
                    </span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${actionStyles(battery.recommended_action)} bg-white/95`}>
                      {battery.recommended_action}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold leading-tight mb-4">{battery.pack_id}</h2>
                  <p className="text-white/82 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Current SoH snapshot: {fmtPercent(battery.soh)}. This page bundles pack-level and cell-level intelligence for operational packaging and battery handling.
                  </p>
                </div>

                <div className="rounded-[22px] bg-black/10 border border-white/15 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-soft-mint mb-3">Current Summary</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Battery ID</span>
                      <span className="font-semibold">{battery.id}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Pack-level result</span>
                      <span className="font-semibold capitalize">{packAnalysis?.recommended_action ?? 'Pending'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Cell-level result</span>
                      <span className="font-semibold">{cellAnalysis ? 'Available' : 'Not run yet'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Marketplace price</span>
                      <span className="font-semibold">{fmtPrice(battery.marketplace_listing?.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <OverviewMetric icon={Activity} label="State of Health" value={fmtPercent(battery.soh)} subtext="Latest health status" />
              <OverviewMetric icon={ShieldCheck} label="Recommended Action" value={battery.recommended_action ?? '—'} subtext="Current AI recommendation" />
              <OverviewMetric icon={CalendarClock} label="Last Updated" value={battery.last_updated ?? '—'} subtext="Last recorded activity" />
              <OverviewMetric icon={Boxes} label="Status" value={battery.status ?? '—'} subtext="Lifecycle status" />
            </section>

            <section className="rounded-[24px] border border-[#D7D7D7] bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-3">Battery Details</p>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                <SpecItem label="Battery ID" value={battery.id} />
                <SpecItem label="Pack ID" value={battery.pack_id} />
                <SpecItem label="Source" value={battery.source} />
                <SpecItem label="Chemistry" value={battery.chemistry} />
                <SpecItem label="OCV (V)" value={battery.ocv_v} />
                <SpecItem label="Capacity (Ah)" value={battery.capacity_ah} />
                <SpecItem label="Cycle Count" value={battery.cycle_count} />
                <SpecItem label="Temperature (°C)" value={battery.temperature_c} />
                <SpecItem label="Age (days)" value={battery.age_days} />
                <SpecItem label="Condition" value={battery.condition} />
                <SpecItem label="Marketplace Price" value={fmtPrice(battery.marketplace_listing?.price)} />
                <SpecItem label="Listing Status" value={battery.marketplace_listing?.status ?? 'Not listed'} />
              </div>
            </section>

            <section className="grid lg:grid-cols-3 gap-6 items-start">
              <div className="rounded-[24px] border border-[#D7D7D7] bg-white p-6 shadow-sm lg:col-span-1">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                    <Cpu size={20} className="text-deep-blue" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-bright-green">Model 1</p>
                    <h3 className="text-xl font-bold text-deep-blue">Pack-Level Analysis</h3>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-dark-gray">Predicted SoH</span>
                    <span className="text-xl font-bold text-deep-blue">{fmtPercent(packAnalysis?.predicted_soh)}</span>
                  </div>
                  <ProgressBar value={Math.round((packAnalysis?.predicted_soh ?? 0) * 100)} max={100} color={sohColor(packAnalysis?.predicted_soh ?? 0)} animated={false} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <SpecItem label="Confidence" value={fmtPercent(packAnalysis?.confidence_score)} />
                  <SpecItem label="Recommended Action" value={packAnalysis?.recommended_action ?? 'Pending'} />
                </div>

                <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-2">AI Notes</p>
                  {packAnalysis?.notes?.length > 0 ? (
                    <ul className="space-y-1.5 text-sm text-dark-gray">
                      {packAnalysis.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <span className="text-bright-green">•</span>
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-dark-gray leading-relaxed">
                      No additional Model 1 notes were stored for this battery.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[24px] border border-[#D7D7D7] bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                    <FlaskConical size={20} className="text-deep-blue" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-bright-green">Model 2</p>
                    <h3 className="text-xl font-bold text-deep-blue">Cell-Level Analysis</h3>
                  </div>
                </div>

                {cellAnalysis ? (
                  <div className="space-y-5">
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      <SpecItem label="Cells Analyzed" value={cellAnalysis.summary?.total_cells} />
                      <SpecItem label="Compatible for Repack" value={cellAnalysis.summary?.valid_for_repack} />
                      <SpecItem label="Outliers" value={cellAnalysis.summary?.outlier_count} />
                      <SpecItem label="Recommended Packs" value={cellAnalysis.summary?.recommended_pack_count} />
                      <SpecItem label="Clusters Found" value={cellAnalysis.summary?.clusters_found} />
                      <SpecItem label="Repack Rate" value={fmtPercent(repackRate)} />
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-3">Compatible Cell List</p>
                      <CellCompatibilityMatrix results={cellAnalysis.results ?? []} />
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-3">Pack Recommendations</p>
                      {(cellAnalysis.recommended_packs ?? []).length > 0 ? (
                        <PackAssemblyRecommendation packs={cellAnalysis.recommended_packs} />
                      ) : (
                        <p className="text-sm text-dark-gray">No pack recommendations could be generated from the current cell pool.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-[20px] bg-light-gray p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                        <CircuitBoard size={18} className="text-deep-blue" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-deep-blue mb-1">No cell-level analysis yet.</p>
                        <p className="text-sm text-dark-gray leading-relaxed">
                          Model 2 data has not been recorded for this battery yet.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default PublicBatteryProfile;
