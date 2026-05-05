import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Battery, BadgeCheck, Star, MapPin, MessageCircle, Share2, Sun, Zap, Plug, Clock, AlertCircle } from 'lucide-react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import ProgressBar from '../components/ui/ProgressBar';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const TABS = ['Overview', 'Technical Specs', 'Health Report', 'Recommended Usage', 'Seller Info'];

function fmtPrice(n) {
  if (!n) return '—';
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1)}M`;
  return `Rp ${n.toLocaleString('id-ID')}`;
}

function sohColor(soh) {
  if (soh >= 0.80) return 'bright-green';
  if (soh >= 0.60) return 'soft-mint';
  if (soh >= 0.40) return 'lime-green';
  return 'red';
}

function TabBar({ active, setActive }) {
  return (
    <div className="flex gap-1 border-b border-[#AAAAAA] overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={[
            'px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors',
            active === tab
              ? 'border-bright-green text-deep-blue'
              : 'border-transparent text-dark-gray hover:text-deep-blue',
          ].join(' ')}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

function OverviewTab({ battery }) {
  const sohPct = Math.round(battery.soh * 100);
  return (
    <div className="space-y-5 py-5">
      <div>
        <h2 className="text-xl font-bold text-deep-blue">{battery.model_name}</h2>
        <p className="text-sm text-dark-gray mt-1">
          {battery.chemistry} · {battery.voltage_v ?? '—'} V · {battery.capacity_ah ?? '—'} Ah
        </p>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-dark-gray">State of Health</span>
          <span className="text-lg font-bold text-deep-blue">{sohPct}%</span>
        </div>
        <ProgressBar value={sohPct} max={100} color={sohColor(battery.soh)} />
      </div>
      <div className="flex items-center gap-2 text-sm text-dark-gray">
        <BadgeCheck size={16} className="text-bright-green" />
        Verified by AI Assessment
      </div>
    </div>
  );
}

function SpecsTab({ battery }) {
  const specs = [
    { label: 'Voltage (V)',        value: battery.voltage_v    ?? '—' },
    { label: 'Capacity (Ah)',      value: battery.capacity_ah  ?? '—' },
    { label: 'Cycle Count',        value: battery.cycles       ?? '—' },
    { label: 'Age (days)',         value: battery.age_days     ?? '—' },
    { label: 'Chemistry',          value: battery.chemistry    ?? '—' },
    { label: 'Warranty (months)',  value: battery.warranty_months ?? '—' },
  ];
  return (
    <div className="py-5">
      <dl className="divide-y divide-[#AAAAAA]">
        {specs.map(({ label, value }) => (
          <div key={label} className="flex justify-between py-3 text-sm">
            <dt className="text-dark-gray">{label}</dt>
            <dd className="font-semibold text-[#222222]">{String(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HealthTab({ battery }) {
  const sohPct   = Math.round(battery.soh * 100);
  const chartData = [{ name: 'SoH', value: sohPct, fill: '#44CE7F' }];
  const risk      = sohPct >= 80 ? 'Low' : sohPct >= 60 ? 'Medium' : 'High';
  const riskColor = sohPct >= 80 ? 'text-bright-green' : sohPct >= 60 ? 'text-lime-green' : 'text-red-500';

  return (
    <div className="py-5 space-y-5">
      <div className="flex items-center gap-8">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart innerRadius="65%" outerRadius="100%" data={chartData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={6} background={{ fill: '#F5F5F5' }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-3xl font-bold text-deep-blue">{sohPct}%</p>
          <p className="text-sm text-dark-gray">State of Health</p>
          <p className={`text-sm font-semibold mt-1 ${riskColor}`}>Risk Level: {risk}</p>
        </div>
      </div>
      <p className="text-sm text-dark-gray">
        This battery shows stable degradation with no anomalies detected. Suitable for secondary use applications with proper care.
      </p>
    </div>
  );
}

function UsageTab({ battery }) {
  const useCases = [
    { label: 'Solar Storage',  icon: Sun,  score: Math.round(battery.soh * 9.5) },
    { label: 'EV Replacement', icon: Zap,  score: Math.round(battery.soh * 8.5) },
    { label: 'Backup Power',   icon: Plug, score: Math.round(battery.soh * 10)  },
  ];
  const estYears = Math.round(battery.soh * 8);
  const co2Saved = ((battery.capacity_ah ?? 50) * 0.15).toFixed(1);

  return (
    <div className="py-5 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {useCases.map(({ label, icon: Icon, score }) => (
          <div key={label} className="bg-light-gray rounded-xl p-4 flex flex-col items-center gap-2 text-center">
            <Icon size={28} className="text-deep-blue" aria-hidden="true" />
            <p className="text-sm font-semibold text-deep-blue">{label}</p>
            <p className="text-xs text-dark-gray">Suitability: {score}/10</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-soft-mint bg-opacity-20 rounded-xl p-4">
          <p className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">Est. Lifespan</p>
          <p className="text-xl font-bold text-deep-blue mt-1">{estYears} years</p>
        </div>
        <div className="bg-lime-green bg-opacity-20 rounded-xl p-4">
          <p className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">CO2 Prevented</p>
          <p className="text-xl font-bold text-deep-blue mt-1">{co2Saved} tons</p>
        </div>
      </div>
    </div>
  );
}

function SellerTab({ battery, showToast }) {
  return (
    <div className="py-5 space-y-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-soft-mint flex items-center justify-center text-deep-blue font-bold text-lg shrink-0">
          {battery.seller_name?.[0]?.toUpperCase() ?? 'S'}
        </div>
        <div>
          <h3 className="font-bold text-deep-blue">{battery.seller_name}</h3>
          <div className="flex items-center gap-1 text-sm text-dark-gray mt-0.5">
            <MapPin size={12} />
            {battery.seller_location}
          </div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <Star size={12} className="text-lime-green" fill="#ACEA63" />
            <span className="font-semibold">{battery.rating?.toFixed(1)}</span>
            <span className="text-dark-gray">rating</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-sm text-dark-gray">
        <Clock size={13} />
        Avg. response time: 2 hours
      </div>
      <div className="flex gap-3 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2.5 bg-deep-blue text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
          <MessageCircle size={15} />
          Message Seller
        </button>
      </div>
    </div>
  );
}

function BatteryDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const fetchBattery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/marketplace`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      const found = (data.batteries ?? []).find((b) => b.id === id);
      if (!found) throw new Error('Battery not found.');
      setBattery(found);
    } catch (err) {
      setError(err.message || 'Failed to load battery details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchBattery(); }, [fetchBattery]);

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <Header />

      {/* Sub-header */}
      <div className="bg-white border-b border-[#AAAAAA] px-4 sm:px-6 h-14 flex items-center gap-3">
        <button
          onClick={() => navigate('/marketplace')}
          className="flex items-center gap-1.5 text-dark-gray hover:text-deep-blue transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} />
          Marketplace
        </button>
        <span className="text-[#AAAAAA] text-sm">/</span>
        <span className="text-deep-blue font-semibold text-sm truncate">
          {battery?.model_name ?? 'Battery Details'}
        </span>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold text-sm">Loading battery details…</p>
          </div>
        )}

        {error && !loading && (
          <div className="space-y-3">
            <Alert type="error" title="Not Found" message={error} />
            <button onClick={fetchBattery} className="text-sm text-bright-green font-semibold hover:underline">Retry</button>
          </div>
        )}

        {!loading && !error && battery && (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Left column */}
            <div className="lg:w-64 shrink-0 space-y-4">
              <div className="bg-white rounded-[20px] border border-[#AAAAAA] p-6 text-center shadow-sm">
                <div className="w-28 h-28 bg-light-gray rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Battery size={56} className="text-[#AAAAAA]" strokeWidth={1.2} />
                </div>

                {battery.verified && (
                  <span className="inline-flex items-center gap-1 bg-bright-green text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    <BadgeCheck size={12} />
                    AI Verified
                  </span>
                )}

                <div className="flex items-center justify-center gap-1 text-sm mb-3">
                  <Star size={14} className="text-lime-green" fill="#ACEA63" />
                  <span className="font-bold">{battery.rating?.toFixed(1)}</span>
                </div>

                <p className="text-2xl font-bold text-deep-blue mb-1">{fmtPrice(battery.price)}</p>
                <p className="text-sm text-dark-gray">{battery.seller_name}</p>
                <div className="flex items-center justify-center gap-1 text-xs text-dark-gray mt-0.5">
                  <MapPin size={11} />
                  {battery.seller_location}
                </div>

                <button className="mt-4 w-full flex items-center justify-center gap-2 bg-bright-green text-white text-sm font-semibold py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                  <MessageCircle size={15} />
                  Message Seller
                </button>
              </div>

              {/* Share / Report */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#AAAAAA] rounded-xl text-sm text-dark-gray hover:text-deep-blue hover:border-deep-blue transition-colors">
                  <Share2 size={14} />
                  Share
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#AAAAAA] rounded-xl text-sm text-dark-gray hover:text-red-500 hover:border-red-300 transition-colors">
                  <AlertCircle size={14} />
                  Report
                </button>
              </div>
            </div>

            {/* Right column — tabs */}
            <div className="flex-1 bg-white rounded-[20px] border border-[#AAAAAA] shadow-sm overflow-hidden">
              <div className="px-6 pt-4">
                <TabBar active={activeTab} setActive={setActiveTab} />
              </div>
              <div className="px-6">
                {activeTab === 'Overview'           && <OverviewTab  battery={battery} />}
                {activeTab === 'Technical Specs'    && <SpecsTab     battery={battery} />}
                {activeTab === 'Health Report'      && <HealthTab    battery={battery} />}
                {activeTab === 'Recommended Usage'  && <UsageTab     battery={battery} />}
                {activeTab === 'Seller Info'        && <SellerTab    battery={battery} />}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default BatteryDetail;
