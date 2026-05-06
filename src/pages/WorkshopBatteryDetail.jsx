import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Activity, BatteryMedium, Boxes, CalendarClock, CircuitBoard,
  Cpu, FlaskConical, Printer, QrCode, ShieldCheck, Store,
} from 'lucide-react';
import Alert from '../components/ui/Alert';
import Spinner from '../components/ui/Spinner';
import WorkshopHeader from '../components/layout/WorkshopHeader';
import ProgressBar from '../components/ui/ProgressBar';
import CellInputForm from '../components/forms/CellInputForm';
import CellCompatibilityMatrix from '../components/specialty/CellCompatibilityMatrix';
import PackAssemblyRecommendation from '../components/specialty/PackAssemblyRecommendation';
import Button from '../components/ui/Button';
import { useToast } from '../hooks/useToast';
import api from '../utils/api';

const MODEL_API_BASE = import.meta.env.VITE_MODEL_API_BASE_URL || 'http://localhost:8001';

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

function WorkshopBatteryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cellFormOpen, setCellFormOpen] = useState(false);
  const [cellLoading, setCellLoading] = useState(false);
  const [cellError, setCellError] = useState(null);
  const [listingModalOpen, setListingModalOpen] = useState(false);
  const [listingPrice, setListingPrice] = useState('');
  const [listingLoading, setListingLoading] = useState(false);
  const [listingError, setListingError] = useState(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const fetchBattery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/inventory/${id}`);
      setBattery(res.data.battery);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load battery details.');
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
  const cellResults = useMemo(() => cellAnalysis?.results ?? [], [cellAnalysis]);
  const repackRate = cellAnalysis?.summary?.repack_rate ?? 0;

  const clusterGroups = useMemo(() => {
    const groups = new Map();
    cellResults.forEach((cell) => {
      if (cell.cluster === null || cell.cluster === undefined) return;
      const key = String(cell.cluster);
      const existing = groups.get(key) ?? [];
      existing.push(cell);
      groups.set(key, existing);
    });

    return Array.from(groups.entries())
      .map(([clusterId, cells]) => ({ clusterId, cells }))
      .sort((left, right) => Number(left.clusterId) - Number(right.clusterId));
  }, [cellResults]);

  const outlierCells = useMemo(
    () => cellResults.filter((cell) => cell.is_outlier),
    [cellResults],
  );

  const compatibleCells = useMemo(
    () => cellResults.filter((cell) => (cell.compatible_with ?? []).length > 0),
    [cellResults],
  );

  const marketplaceListing = battery?.marketplace_listing ?? null;
  const publicProfileUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/battery-profile/${id}`;
  }, [id]);
  const qrImageUrl = useMemo(() => {
    if (!publicProfileUrl) return '';
    return `https://quickchart.io/qr?size=280&text=${encodeURIComponent(publicProfileUrl)}`;
  }, [publicProfileUrl]);

  const openListingModal = () => {
    setListingError(null);
    setListingPrice(
      marketplaceListing?.price !== null && marketplaceListing?.price !== undefined
        ? String(marketplaceListing.price)
        : '',
    );
    setListingModalOpen(true);
  };

  const handlePublishListing = async () => {
    setListingLoading(true);
    setListingError(null);
    try {
      const price = Number.parseInt(listingPrice, 10);
      if (Number.isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid marketplace price.');
      }

      const res = await api.post(`/inventory/${id}/marketplace-listing`, {
        price,
      });
      setBattery(res.data.battery);
      setListingModalOpen(false);
      showToast({
        message: marketplaceListing ? 'Marketplace listing updated successfully!' : 'Battery added to marketplace successfully!',
        type: 'success',
      });
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Failed to publish battery to marketplace.';
      setListingError(msg);
      showToast({ message: msg, type: 'error', duration: 6000 });
    } finally {
      setListingLoading(false);
    }
  };

  const handleCellAnalysisSubmit = async ({ cells, assembly_request }) => {
    setCellLoading(true);
    setCellError(null);
    try {
      const response = await fetch(`${MODEL_API_BASE}/predict-cells`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cells, assembly_request }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed — status ${response.status}`);
      }

      const data = await response.json();
      const saveRes = await api.post(`/inventory/${id}/cell-analysis`, {
        analysis_result: data,
      });
      setBattery(saveRes.data.battery);
      setCellFormOpen(false);
      showToast({ message: 'Cell analysis saved to inventory successfully!', type: 'success' });
    } catch (err) {
      const msg = err.message || err.response?.data?.detail || 'Failed to analyze battery cells.';
      setCellError(msg);
      showToast({ message: msg, type: 'error', duration: 6000 });
    } finally {
      setCellLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <WorkshopHeader />

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <button
              type="button"
              onClick={() => navigate('/inventory')}
              className="text-sm font-medium text-dark-gray hover:text-deep-blue transition-colors mb-3"
            >
              ← Back to Inventory
            </button>
            <h1 className="text-3xl font-bold text-deep-blue">{battery?.id ?? id}</h1>
            <p className="text-sm text-dark-gray mt-1">
              Review pack-level insight, run cell-level analysis, and revisit workshop battery intelligence.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {marketplaceListing && (
              <span className="inline-flex items-center gap-2 rounded-full bg-[#DFF7E4] px-4 py-2 text-sm font-semibold text-deep-blue">
                <Store size={14} aria-hidden="true" />
                Listed at {fmtPrice(marketplaceListing.price)}
              </span>
            )}
            <Button variant="secondary" size="sm" onClick={() => setQrModalOpen(true)}>
              <QrCode size={16} className="mr-1" aria-hidden="true" />
              Battery QR Profile
            </Button>
            <Button variant={marketplaceListing ? 'secondary' : 'primary'} size="sm" onClick={openListingModal}>
              {marketplaceListing ? 'Update Marketplace Listing' : 'Add to Marketplace'}
            </Button>
            {marketplaceListing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/battery/${marketplaceListing.id}`)}
              >
                View Customer Listing
              </Button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold">Loading battery detail…</p>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-3">
            <Alert type="error" title="Failed to load battery" message={error} />
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
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-soft-mint mb-4">Workshop Inventory Battery</p>
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
                  <h2 className="text-4xl font-bold leading-tight mb-4">{fmtPercent(battery.soh)} current SoH snapshot</h2>
                  <p className="text-white/82 text-sm sm:text-base max-w-2xl leading-relaxed">
                    This battery is now tied to your inventory record. Pack-level results are stored here, and cell-level analysis can be added from this page whenever you need deeper repack insight.
                  </p>
                </div>

                <div className="rounded-[22px] bg-black/10 border border-white/15 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-soft-mint mb-3">Current Summary</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Last updated</span>
                      <span className="font-semibold">{battery.last_updated ?? '—'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Pack-level result</span>
                      <span className="font-semibold capitalize">{packAnalysis?.recommended_action ?? 'Pending'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-white/72">Cell-level result</span>
                      <span className="font-semibold">{cellAnalysis ? 'Available' : 'Not run yet'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
              <OverviewMetric icon={Activity} label="State of Health" value={fmtPercent(battery.soh)} subtext="Latest inventory health status" />
              <OverviewMetric icon={ShieldCheck} label="Recommended Action" value={battery.recommended_action ?? '—'} subtext="Current battery recommendation" />
              <OverviewMetric icon={CalendarClock} label="Last Updated" value={battery.last_updated ?? '—'} subtext="Last inventory activity" />
              <OverviewMetric icon={Boxes} label="Status" value={battery.status ?? '—'} subtext="Lifecycle status in workshop inventory" />
            </section>

            <section className="rounded-[24px] border border-[#D7D7D7] bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-2">Marketplace Readiness</p>
                  <h3 className="text-xl font-bold text-deep-blue mb-2">
                    {marketplaceListing ? 'This battery is already visible to customers.' : 'Publish this battery to the customer marketplace.'}
                  </h3>
                  <p className="text-sm text-dark-gray leading-relaxed max-w-3xl">
                    {marketplaceListing
                      ? `Customers can now browse this battery listing with the latest AI-assessed health information. Current asking price: ${fmtPrice(marketplaceListing.price)}.`
                      : 'Once you are happy with the AI insight, set a selling price and publish this battery so it appears in the customer marketplace.'}
                  </p>
                </div>
                <Button variant={marketplaceListing ? 'secondary' : 'primary'} size="sm" onClick={openListingModal}>
                  {marketplaceListing ? 'Update Price' : 'Set Price & Publish'}
                </Button>
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
                  <div className="rounded-[18px] bg-light-gray p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Confidence</p>
                    <p className="text-lg font-bold text-deep-blue">
                      {packAnalysis?.confidence_score !== null && packAnalysis?.confidence_score !== undefined
                        ? fmtPercent(packAnalysis.confidence_score)
                        : 'Not available'}
                    </p>
                  </div>
                  <div className="rounded-[18px] bg-light-gray p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Recommended Action</p>
                    <p className="text-lg font-bold text-deep-blue capitalize">{packAnalysis?.recommended_action ?? 'Pending'}</p>
                  </div>
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
                <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                      <FlaskConical size={20} className="text-deep-blue" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-bright-green">Model 2</p>
                      <h3 className="text-xl font-bold text-deep-blue">Cell-Level Analysis</h3>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setCellFormOpen((open) => !open); setCellError(null); }}
                    className="text-sm font-semibold text-bright-green hover:underline"
                  >
                    {cellFormOpen ? 'Hide cell input' : cellAnalysis ? 'Run again' : 'Add cell analysis'}
                  </button>
                </div>

                {cellAnalysis ? (
                  <div className="space-y-5 mb-6">
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Cells Analyzed</p>
                        <p className="text-lg font-bold text-deep-blue">{cellAnalysis.summary?.total_cells ?? 0}</p>
                      </div>
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Compatible for Repack</p>
                        <p className="text-lg font-bold text-deep-blue">{cellAnalysis.summary?.valid_for_repack ?? 0}</p>
                      </div>
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Outliers</p>
                        <p className="text-lg font-bold text-deep-blue">{cellAnalysis.summary?.outlier_count ?? 0}</p>
                      </div>
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Recommended Packs</p>
                        <p className="text-lg font-bold text-deep-blue">{cellAnalysis.summary?.recommended_pack_count ?? 0}</p>
                      </div>
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Clusters Found</p>
                        <p className="text-lg font-bold text-deep-blue">{cellAnalysis.summary?.clusters_found ?? 0}</p>
                      </div>
                      <div className="rounded-[18px] bg-light-gray p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Repack Rate</p>
                        <p className="text-lg font-bold text-deep-blue">{fmtPercent(repackRate)}</p>
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-2">Cell Eligibility Status</p>
                      <p className="text-sm text-dark-gray leading-relaxed mb-3">
                        Model 2 marks which cells are safe repack candidates and which ones are outliers. This summary helps you see how much of the battery survives for second-life assembly.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(cellAnalysis.summary?.status_breakdown ?? {}).map(([status, count]) => (
                          <span key={status} className="inline-flex rounded-full bg-soft-mint/40 px-3 py-1 text-xs font-semibold text-deep-blue">
                            {status} · {count}
                          </span>
                        ))}
                        {Object.keys(cellAnalysis.summary?.status_breakdown ?? {}).length === 0 && (
                          <span className="text-sm text-dark-gray">No status breakdown was generated for this run.</span>
                        )}
                      </div>
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Cluster Groups</p>
                          <p className="text-sm text-dark-gray">
                            Cells with similar IR and OCV profiles are grouped into compatibility clusters.
                          </p>
                        </div>
                        <span className="rounded-full bg-light-gray px-3 py-1 text-xs font-semibold text-deep-blue">
                          {clusterGroups.length} cluster{clusterGroups.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {clusterGroups.length > 0 ? (
                        <div className="grid lg:grid-cols-2 gap-3">
                          {clusterGroups.map(({ clusterId, cells }) => (
                            <div key={clusterId} className="rounded-[16px] bg-light-gray p-4">
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <p className="text-sm font-bold text-deep-blue">Cluster C{clusterId}</p>
                                <span className="text-xs font-semibold text-dark-gray">
                                  {cells.length} cell{cells.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {cells.map((cell) => (
                                  <span key={cell.cell_id} className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-deep-blue">
                                    {cell.cell_id}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-dark-gray">No similarity clusters were produced. This usually means the inputs were all outliers or too limited to group.</p>
                      )}
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Compatible Cell List</p>
                          <p className="text-sm text-dark-gray">
                            Review per-cell status, outlier flags, cluster membership, and compatible peers in one place.
                          </p>
                        </div>
                        <span className="rounded-full bg-light-gray px-3 py-1 text-xs font-semibold text-deep-blue">
                          {compatibleCells.length} cell{compatibleCells.length !== 1 ? 's' : ''} with compatible peers
                        </span>
                      </div>
                      <CellCompatibilityMatrix results={cellResults} />
                    </div>

                    <div className="rounded-[18px] border border-[#D7D7D7] p-4">
                      <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Pack Recommendations</p>
                          <p className="text-sm text-dark-gray">
                            Suggested new pack assemblies built from mutually compatible cells.
                          </p>
                        </div>
                        <span className="rounded-full bg-light-gray px-3 py-1 text-xs font-semibold text-deep-blue">
                          {(cellAnalysis.recommended_packs ?? []).length} recommendation{(cellAnalysis.recommended_packs ?? []).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {(cellAnalysis.recommended_packs ?? []).length > 0 ? (
                        <PackAssemblyRecommendation packs={cellAnalysis.recommended_packs} />
                      ) : (
                        <p className="text-sm text-dark-gray">
                          No pack recommendations could be generated from the current cell pool.
                        </p>
                      )}
                    </div>

                    {outlierCells.length > 0 && (
                      <div className="rounded-[18px] border border-red-100 bg-red-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-red-600 mb-2">Outlier Cells</p>
                        <div className="flex flex-wrap gap-2">
                          {outlierCells.map((cell) => (
                            <span key={cell.cell_id} className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600">
                              {cell.cell_id}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="rounded-[20px] bg-light-gray p-5 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                        <CircuitBoard size={18} className="text-deep-blue" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-deep-blue mb-1">No cell-level analysis yet.</p>
                        <p className="text-sm text-dark-gray leading-relaxed">
                          Add Model 2 analysis here to store compatibility and repack insight directly on this battery record.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {cellError && (
                  <div className="mb-4">
                    <Alert type="error" title="Cell analysis failed" message={cellError} dismissible onDismiss={() => setCellError(null)} />
                  </div>
                )}

                {cellFormOpen && (
                  <div className="rounded-[20px] border border-[#D7D7D7] p-5">
                    <CellInputForm
                      onSubmit={handleCellAnalysisSubmit}
                      isLoading={cellLoading}
                      initialPackResult={packAnalysis}
                    />
                  </div>
                )}
              </div>
            </section>

            {listingModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-bright-green mb-2">Marketplace Listing</p>
                      <h3 className="text-2xl font-bold text-deep-blue">
                        {marketplaceListing ? 'Update listing price' : 'Set marketplace price'}
                      </h3>
                      <p className="text-sm text-dark-gray mt-2 leading-relaxed">
                        This will make the battery visible on the customer marketplace using the current AI pack insight and workshop seller profile.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[20px] bg-light-gray p-4 mb-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A7A7A] mb-1">Battery Snapshot</p>
                    <p className="text-sm font-bold text-deep-blue">{battery.pack_id}</p>
                    <p className="text-sm text-dark-gray mt-1">
                      {battery.chemistry ?? 'Unknown chemistry'} · SoH {fmtPercent(battery.soh)} · {battery.recommended_action ?? 'Pending'}
                    </p>
                  </div>

                  {listingError && (
                    <div className="mb-4">
                      <Alert type="error" title="Could not publish listing" message={listingError} dismissible onDismiss={() => setListingError(null)} />
                    </div>
                  )}

                  <label className="block mb-5">
                    <span className="block text-sm font-semibold text-deep-blue mb-2">Price (Rp)</span>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={listingPrice}
                      onChange={(e) => setListingPrice(e.target.value)}
                      placeholder="e.g. 25000000"
                      className="w-full rounded-xl border border-[#D7D7D7] bg-white px-4 py-3 text-base text-[#222222] outline-none focus:border-deep-blue focus:ring-2 focus:ring-deep-blue/10"
                    />
                  </label>

                  <div className="flex justify-end gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setListingModalOpen(false);
                        setListingError(null);
                      }}
                      disabled={listingLoading}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" size="sm" onClick={handlePublishListing} loading={listingLoading}>
                      {marketplaceListing ? 'Save Listing' : 'Publish Listing'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {qrModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
                <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
                  <div className="mb-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-bright-green mb-2">Operational QR Label</p>
                    <h3 className="text-2xl font-bold text-deep-blue">Battery QR Profile</h3>
                    <p className="text-sm text-dark-gray mt-2 leading-relaxed">
                      Scan this QR code to open the battery profile page with pack-level insight, cell-level analysis, and operational details. Intended for printing on offline battery packaging.
                    </p>
                  </div>

                  <div className="rounded-[24px] border border-[#D7D7D7] bg-light-gray p-5 mb-5">
                    <div className="bg-white rounded-[18px] p-4 shadow-sm">
                      <img
                        src={qrImageUrl}
                        alt={`QR code for battery profile ${battery?.pack_id ?? id}`}
                        className="mx-auto h-64 w-64 rounded-[16px] bg-white object-contain"
                      />
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm font-bold text-deep-blue">{battery?.pack_id ?? id}</p>
                      <p className="text-xs text-dark-gray break-all">{publicProfileUrl}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 flex-wrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        showToast({ message: 'Print label is mocked for MVP.', type: 'info' });
                      }}
                    >
                      <Printer size={16} className="mr-1" aria-hidden="true" />
                      Print Label
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setQrModalOpen(false);
                        navigate(`/battery-profile/${id}`);
                      }}
                    >
                      Open Profile
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => setQrModalOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default WorkshopBatteryDetail;
