import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Battery, Leaf, Star, Building2,
  ShieldX, Clock3, TrendingDown, Trash2, PackageX, BarChart3,
  Cpu, ShoppingBag, Recycle, DollarSign,
  Upload, Zap, CheckCircle, ArrowRight,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BatteryCard from '../components/specialty/BatteryCard';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';

const STATS = [
  { value: '450K+',  label: 'Batteries Recovered', icon: Battery   },
  { value: '50,000+',label: 'Tons CO2 Prevented',  icon: Leaf      },
  { value: '320+',   label: 'Active Workshops',     icon: Building2 },
  { value: '12,500', label: 'Customers Served',     icon: Star      },
];

const PROBLEMS = [
  { icon: ShieldX,      title: 'No Trust in Used Batteries',   desc: 'Buyers hesitate due to unknown history, hidden degradation, and zero quality guarantees.' },
  { icon: Clock3,       title: 'Manual Assessment',             desc: 'Traditional battery testing takes days and requires expensive lab equipment.' },
  { icon: TrendingDown, title: 'Informal Pricing',              desc: 'Prices driven by guesswork — leaving money on the table for sellers and buyers alike.' },
  { icon: Trash2,       title: 'Waste Management Crisis',       desc: 'Without a formal recycling chain, 60%+ of EV batteries end up in landfills.' },
  { icon: PackageX,     title: 'No Marketplace',                desc: 'No single platform connects workshops, refurbishers, and end-buyers at scale.' },
  { icon: BarChart3,    title: 'Low Value Recovery',            desc: 'Second-life potential is lost — batteries worth millions are scrapped prematurely.' },
];

const SOLUTIONS = [
  { icon: Cpu,         title: 'AI Battery Screening',  desc: 'Predict State of Health from 12+ diagnostics in under 30 seconds.',     color: 'bg-deep-blue text-white'    },
  { icon: DollarSign,  title: 'Smart Pricing Engine',  desc: 'Dynamic price suggestions based on health score, chemistry, and demand.', color: 'bg-bright-green text-white'  },
  { icon: ShoppingBag, title: 'Trusted Marketplace',   desc: 'Every battery AI-verified before listing. Buyers see exactly what they get.', color: 'bg-soft-mint text-deep-blue' },
  { icon: Recycle,     title: 'Circular Recycling',    desc: "Batteries that can't be repacked route to certified recycling partners.", color: 'bg-lime-green text-deep-blue' },
];

const STEPS = [
  { num: '1', icon: Upload,      title: 'Upload Battery Data',  desc: 'Workshop scans OCV, IR, cycle count, and temperature.' },
  { num: '2', icon: Cpu,         title: 'AI Analyzes Health',   desc: 'Model predicts State of Health with a confidence score.' },
  { num: '3', icon: CheckCircle, title: 'Get Recommendation',   desc: 'Recondition, repack, or recycle — with full reasoning.' },
  { num: '4', icon: ShoppingBag, title: 'Sell & Reuse',         desc: 'List on marketplace and connect with verified buyers.' },
];

const TESTIMONIALS = [
  { name: 'Budi Santoso', role: 'Workshop Owner, Jakarta',  rating: 5, text: 'ReVoltz cut our assessment time from 2 days to 30 seconds. Revenue is up 40% since joining.' },
  { name: 'Sari Dewi',    role: 'EV Fleet Manager',         rating: 5, text: 'We replaced 12 packs through the marketplace. Every battery performed exactly as rated.' },
  { name: 'Ahmad Fauzi',  role: 'Solar Farm Operator',      rating: 5, text: 'The recycling network keeps us compliant and helps us get fair value for end-of-life batteries.' },
];

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function Landing() {
  const navigate = useNavigate();
  const [marketplaceBatteries, setMarketplaceBatteries] = useState([]);
  const [marketplaceLoading, setMarketplaceLoading] = useState(true);
  const [marketplaceError, setMarketplaceError] = useState(null);

  const fetchMarketplacePreview = useCallback(async () => {
    setMarketplaceLoading(true);
    setMarketplaceError(null);
    try {
      const res = await fetch(`${API_BASE}/marketplace`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setMarketplaceBatteries((data.batteries ?? []).slice(0, 3));
    } catch (err) {
      setMarketplaceError(err.message || 'Failed to load marketplace preview.');
    } finally {
      setMarketplaceLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchMarketplacePreview(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchMarketplacePreview]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        className="relative text-white overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute left-[-6rem] top-1/3 h-56 w-56 rounded-full bg-[#ACEA63]/20 blur-3xl" />
          <div className="absolute bottom-[-5rem] right-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/15 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-12 lg:pb-20 min-h-[68vh] flex items-center">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur mb-6">
              <Battery size={16} className="text-soft-mint" aria-hidden="true" />
              <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-white/90">
                Indonesia&apos;s EV Battery Recovery Platform
              </p>
            </div>
            <h1 className="text-[clamp(2.8rem,6.6vw,5.75rem)] font-bold leading-[0.95] tracking-[-0.04em] mb-5 max-w-4xl">
              Give used EV batteries a second life with confidence.
            </h1>
            <p className="text-white/82 text-base sm:text-lg mb-8 max-w-2xl leading-relaxed">
              ReVoltz combines AI health screening, trusted resale, and certified recycling so every battery gets the highest-value next step.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-deep-blue font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
              >
                Get Started
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Explore Marketplace
              </button>
              <button
                onClick={() => navigate('/partner')}
                className="px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Become a Partner
              </button>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              {[
                'AI screening in under 30 seconds',
                'Verified resale for second-life packs',
                'Certified routing for end-of-life batteries',
              ].map((item) => (
                <div
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 py-2 backdrop-blur"
                >
                  <CheckCircle size={16} className="text-soft-mint" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS (mobile — shows below hero) ────────────────────────── */}
      <section className="lg:hidden bg-white py-10 px-4">
        <div className="max-w-xl mx-auto grid grid-cols-2 gap-6">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center mx-auto mb-2">
                <Icon size={18} className="text-deep-blue" />
              </div>
              <p className="text-2xl font-bold text-deep-blue">{value}</p>
              <p className="text-xs text-dark-gray mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROBLEMS ─────────────────────────────────────────────────── */}
      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">The Battery Problem</h2>
          <p className="text-dark-gray text-sm max-w-xl mx-auto">
            Indonesia's EV battery ecosystem faces critical challenges. Here's what the industry deals with today.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROBLEMS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-[20px] p-6 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all">
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                <Icon size={20} className="text-red-500" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-bold text-deep-blue mb-2">{title}</h3>
              <p className="text-xs text-dark-gray leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">The ReVoltz Solution</h2>
          <p className="text-dark-gray text-sm max-w-xl mx-auto">
            Four integrated pillars that transform how Indonesia handles second-life EV batteries.
          </p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SOLUTIONS.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className={`rounded-[20px] p-6 flex gap-4 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all ${color}`}>
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <Icon size={20} aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-sm font-bold mb-1">{title}</h3>
                <p className="text-xs opacity-80 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">How It Works</h2>
          <p className="text-dark-gray text-sm">From battery scan to marketplace listing in minutes.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ num, icon: Icon, title, desc }, idx) => (
            <div key={num} className="relative">
              {/* Connector line — desktop */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-7 left-[calc(50%+28px)] right-0 h-px bg-[#AAAAAA]/40 z-0" style={{ width: 'calc(100% - 56px + 24px)' }} />
              )}
              <div className="bg-white rounded-[20px] p-5 text-center shadow-sm relative z-10 h-full">
                <div className="relative inline-flex mb-4">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                    <Icon size={22} className="text-white" aria-hidden="true" />
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-green text-deep-blue text-xs font-bold rounded-full flex items-center justify-center shadow">
                    {num}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-deep-blue mb-1.5">{title}</h3>
                <p className="text-xs text-dark-gray leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARKETPLACE PREVIEW ──────────────────────────────────────── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">Verified Battery Marketplace</h2>
            <p className="text-dark-gray text-sm max-w-xl mx-auto">
              Browse AI-verified second-life batteries from trusted workshops across Indonesia.
            </p>
          </div>

          {marketplaceError && (
            <div className="mb-6">
              <Alert type="error" title="Marketplace preview unavailable" message={marketplaceError} />
            </div>
          )}

          {marketplaceLoading && (
            <div className="flex flex-col items-center justify-center py-14 gap-4 mb-8">
              <Spinner size="lg" color="bright-green" />
              <p className="text-dark-gray text-sm font-semibold">Loading marketplace preview…</p>
            </div>
          )}

          {!marketplaceLoading && !marketplaceError && marketplaceBatteries.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {marketplaceBatteries.map((bat) => (
                <BatteryCard key={bat.id} battery={bat} showWishlist={false} />
              ))}
            </div>
          )}

          {!marketplaceLoading && !marketplaceError && marketplaceBatteries.length === 0 && (
            <div className="mb-8 rounded-[24px] border border-[#D7D7D7] bg-light-gray px-6 py-10 text-center">
              <p className="text-lg font-bold text-deep-blue mb-2">No live marketplace listings yet</p>
              <p className="text-sm text-dark-gray max-w-xl mx-auto">
                Published workshop batteries will appear here automatically once they are listed from inventory.
              </p>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 transition-opacity shadow"
            >
              Browse All Batteries
            </button>
          </div>
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────────────────────────── */}
      <section
        className="py-16 px-4 text-white"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Our Impact</h2>
          <p className="text-white/70 text-sm">Real numbers from Indonesia's growing battery circular economy.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: '13,500',  label: 'Batteries reused',    icon: Battery   },
            { value: '58,000+', label: 'Tons CO2 prevented',  icon: Leaf      },
            { value: 'Rp 8B',   label: 'Revenue generated',   icon: BarChart3 },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label}>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Icon size={22} aria-hidden="true" />
              </div>
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-soft-mint text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-2">Trusted by Industry Leaders</h2>
          <p className="text-dark-gray text-sm">What our partners and customers say.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, rating, text }) => (
            <div key={name} className="bg-white rounded-[20px] p-6 shadow-sm">
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                  <Star key={i} size={13} className="text-lime-green" fill="#ACEA63" aria-hidden="true" />
                ))}
              </div>
              <p className="text-sm text-dark-gray leading-relaxed mb-4">"{text}"</p>
              <div>
                <p className="text-sm font-bold text-deep-blue">{name}</p>
                <p className="text-xs text-[#AAAAAA]">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-deep-blue py-20 px-4">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-bright-green opacity-10" />
          <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full bg-soft-mint opacity-10" />
        </div>

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-soft-mint text-xs font-bold uppercase tracking-widest mb-4">Join the Movement</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              Join the Battery<br />Revolution
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-md">
              Thousands of workshops and customers across Indonesia are already transforming the EV battery lifecycle. Be part of the solution.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-3.5 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
              >
                Start Now — It's Free
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-7 py-3.5 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Browse Marketplace
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: 'Free', label: 'To get started', icon: CheckCircle },
              { value: '30s',  label: 'Battery assessment',  icon: Zap         },
              { value: '100%', label: 'AI-verified listings', icon: Star        },
              { value: '24/7', label: 'Platform availability', icon: Building2  },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} className="bg-white/10 rounded-[16px] p-5 border border-white/15">
                <Icon size={20} className="text-soft-mint mb-3" aria-hidden="true" />
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-white/60 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Landing;
