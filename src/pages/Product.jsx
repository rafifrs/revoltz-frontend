import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, BarChart3, Battery, CheckCircle, Clock3, Cpu,
  DollarSign, Recycle, ShieldCheck, ShoppingBag, Upload,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProgressBar from '../components/ui/ProgressBar';

const PLATFORM_PILLARS = [
  {
    icon: Cpu,
    title: 'AI Battery Screening',
    desc: 'Turn raw battery diagnostics into fast, readable State of Health decisions.',
    color: 'bg-deep-blue text-white',
  },
  {
    icon: BarChart3,
    title: 'Workshop Operations',
    desc: 'Manage scans, inventory, and repair decisions in one shared workflow.',
    color: 'bg-soft-mint text-deep-blue',
  },
  {
    icon: ShoppingBag,
    title: 'Verified Marketplace',
    desc: 'List and compare batteries with consistent health visibility for buyers.',
    color: 'bg-bright-green text-white',
  },
  {
    icon: Recycle,
    title: 'Circular Recovery',
    desc: 'Route non-viable batteries to certified recycling and impact tracking.',
    color: 'bg-lime-green text-deep-blue',
  },
];

const AI_FEATURES = [
  'Results in under 30 seconds',
  'Health recommendation with confidence score',
  'Cell-level diagnostics translated into business actions',
  'Supports resale, repack, or recycle decisions',
];

const WORKSHOP_FEATURES = [
  'Inventory visibility across incoming and ready-to-sell batteries',
  'Fast triage for repairable, resellable, and end-of-life packs',
  'Performance and revenue-oriented workshop view',
  'Built for day-to-day operational use, not just reporting',
];

const MARKETPLACE_ITEMS = [
  { name: 'Tesla Model 3 Pack', soh: 0.91, price: 'Rp 45M', badge: 'AI Verified' },
  { name: 'Nissan Leaf Pack', soh: 0.78, price: 'Rp 28M', badge: 'AI Verified' },
  { name: 'BYD Atto 3 Pack', soh: 0.88, price: 'Rp 52M', badge: 'AI Verified' },
];

const RECYCLING_STEPS = [
  'Battery flagged as non-viable for second life',
  'Pickup and routing through certified partners',
  'Material recovery with traceable handling',
  'Impact reporting for circularity and compliance',
];

const FLOW = [
  { icon: Upload, title: 'Upload data', desc: 'Scan voltage, capacity, cycles, and related pack diagnostics.' },
  { icon: Cpu, title: 'Score battery health', desc: 'AI predicts SoH and recommends the highest-value next action.' },
  { icon: DollarSign, title: 'Decide the next use', desc: 'List, repack, hold, or recycle based on the battery profile.' },
  { icon: Recycle, title: 'Close the loop', desc: 'Track resale or recovery outcomes inside one lifecycle view.' },
];

export default function Product() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Header />

      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl sm:h-96 sm:w-96" />
          <div className="absolute left-[-6rem] top-1/3 h-56 w-56 rounded-full bg-[#ACEA63]/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-12 lg:pb-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur mb-6">
              <Battery size={16} className="text-soft-mint" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-white/90">
                ReVoltz Product
              </span>
            </div>

            <h1 className="text-[clamp(2.9rem,6vw,5.7rem)] font-bold leading-[0.96] tracking-[-0.04em] mb-5 max-w-4xl">
              One platform for battery assessment, resale, and responsible recovery.
            </h1>
            <p className="text-white/82 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              ReVoltz is built for operators who need clear battery decisions fast, reliable marketplace trust, and a circular workflow that does not break after first-life use ends.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-deep-blue font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                Start With ReVoltz
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate('/marketplace')}
                className="px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Explore Marketplace
              </button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-white/85">
              {[
                'Battery screening in under 30 seconds',
                'Shared workflow from workshop to resale',
                'Certified routing for end-of-life packs',
              ].map((item) => (
                <div key={item} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4 py-2 backdrop-blur">
                  <CheckCircle size={16} className="text-soft-mint" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">Platform Overview</h2>
            <p className="text-dark-gray text-sm max-w-2xl mx-auto">
              Four connected pillars that mirror the full battery lifecycle shown on the landing page, but with deeper operational detail.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {PLATFORM_PILLARS.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`rounded-[22px] p-6 shadow-sm ${color}`}>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold mb-2">{title}</h3>
                <p className="text-sm leading-relaxed opacity-85">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">How the Product Flows</h2>
            <p className="text-dark-gray text-sm max-w-2xl mx-auto">
              ReVoltz is designed as one continuous decision system, not a collection of disconnected tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {FLOW.map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="bg-white rounded-[22px] p-6 shadow-sm">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                  <Icon size={22} className="text-white" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-2">Step {idx + 1}</p>
                <h3 className="text-lg font-bold text-deep-blue mb-2">{title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-bright-green text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              <Cpu size={14} aria-hidden="true" />
              AI Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-4">Fast battery health decisions with business context.</h2>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed mb-6">
              The AI layer does more than output a number. It translates pack diagnostics into a decision that helps teams know whether a battery should be repaired, sold, or retired.
            </p>
            <ul className="space-y-2.5 mb-6">
              {AI_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#222222]">
                  <CheckCircle size={16} className="text-bright-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Try Battery Screening
            </button>
          </div>

          <div className="bg-light-gray rounded-[24px] p-6 border border-[#D7D7D7]">
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              {[['Battery Voltage', '372.6 V'], ['Capacity', '52.4 Ah'], ['Cycle Count', '248'], ['Scan Time', '< 30 sec']].map(([label, value]) => (
                <div key={label} className="bg-white rounded-xl p-4">
                  <p className="text-xs font-semibold text-[#888888]">{label}</p>
                  <p className="text-deep-blue font-bold mt-1">{value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-[20px] p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-deep-blue">State of Health</p>
                  <p className="text-xs text-dark-gray">High confidence recommendation</p>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-soft-mint px-3 py-1 text-xs font-bold text-deep-blue">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Verified
                </div>
              </div>
              <ProgressBar value={92} max={100} color="bright-green" animated={false} label="Battery health score" />
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-xl bg-light-gray p-4">
                  <p className="text-xs font-semibold text-[#888888]">Recommended action</p>
                  <p className="text-sm font-bold text-deep-blue mt-1">List on marketplace</p>
                </div>
                <div className="rounded-xl bg-light-gray p-4">
                  <p className="text-xs font-semibold text-[#888888]">Expected turnaround</p>
                  <p className="text-sm font-bold text-deep-blue mt-1">Same-day decision</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="bg-white rounded-[24px] p-6 border border-[#D7D7D7] shadow-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { value: '142', label: 'Active batteries' },
                { value: '28', label: 'Today scans' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-[18px] p-4 text-white"
                  style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-white/75 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {[
              { name: 'Tesla Model 3 Pack', soh: 90, note: 'Ready for second-life listing' },
              { name: 'Nissan Leaf Pack', soh: 66, note: 'Consider repack before resale' },
              { name: 'BYD Atto 3 Pack', soh: 84, note: 'Healthy pack with strong value' },
            ].map(({ name, soh, note }) => (
              <div key={name} className="border border-[#D7D7D7] rounded-xl p-4 mb-3 last:mb-0">
                <div className="flex justify-between items-center text-sm font-semibold text-deep-blue mb-2">
                  <span>{name}</span>
                  <span>{soh}%</span>
                </div>
                <ProgressBar value={soh} max={100} color={soh >= 80 ? 'bright-green' : 'lime-green'} animated={false} />
                <p className="text-xs text-dark-gray mt-2">{note}</p>
              </div>
            ))}
          </div>

          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-soft-mint text-deep-blue text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              <BarChart3 size={14} aria-hidden="true" />
              Workshop Operations
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-4">A workshop view built around action, not paperwork.</h2>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed mb-6">
              Operators can see what is in queue, what is market-ready, and what should be routed elsewhere without bouncing between spreadsheets and manual notes.
            </p>
            <ul className="space-y-2.5 mb-6">
              {WORKSHOP_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#222222]">
                  <CheckCircle size={16} className="text-bright-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 border-2 border-deep-blue text-deep-blue font-semibold rounded-xl hover:bg-white transition-colors"
            >
              Create Workshop Account
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-lime-green text-deep-blue text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              <ShoppingBag size={14} aria-hidden="true" />
              Marketplace
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-4">A listing experience buyers can actually trust.</h2>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed mb-6">
              Marketplace trust comes from visibility. ReVoltz pairs inventory with health data so buyers can compare packs more confidently and sellers can justify pricing more clearly.
            </p>
            <ul className="space-y-2.5 mb-6">
              {[
                'AI-verified listings with consistent battery signals',
                'Health-based comparison between available packs',
                'Clearer negotiation grounded in real battery condition',
                'A stronger path from workshop inventory to sale',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#222222]">
                  <CheckCircle size={16} className="text-bright-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => navigate('/marketplace')}
              className="px-6 py-3 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Browse Verified Batteries
            </button>
          </div>

          <div className="space-y-4">
            {MARKETPLACE_ITEMS.map(({ name, soh, price, badge }) => (
              <div key={name} className="bg-light-gray rounded-[20px] p-5 flex items-center gap-4 border border-[#D7D7D7]">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Battery size={22} className="text-deep-blue" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-deep-blue">{name}</p>
                    <span className="text-[11px] bg-bright-green text-white px-2.5 py-1 rounded-full font-semibold">{badge}</span>
                  </div>
                  <p className="text-xs text-dark-gray mt-1 mb-2">State of Health {Math.round(soh * 100)}%</p>
                  <ProgressBar value={Math.round(soh * 100)} max={100} color={soh >= 0.85 ? 'bright-green' : 'lime-green'} animated={false} />
                </div>
                <p className="font-bold text-deep-blue text-sm shrink-0">{price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="bg-white rounded-[24px] p-6 border border-[#D7D7D7] shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                <Clock3 size={20} className="text-deep-blue" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-deep-blue">Recycling workflow</h3>
                <p className="text-sm text-dark-gray">When second life is no longer viable.</p>
              </div>
            </div>
            <div className="space-y-4">
              {RECYCLING_STEPS.map((step, idx) => (
                <div key={step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                    {idx + 1}
                  </div>
                  <p className="text-sm text-[#222222] leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-deep-blue text-white text-xs font-bold rounded-full mb-4 uppercase tracking-wide">
              <Recycle size={14} aria-hidden="true" />
              Circular Recovery
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-4">Responsible recycling stays inside the same product flow.</h2>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed mb-6">
              ReVoltz is not only about finding resale value. It also creates a clear handoff when a battery should leave the second-life market and move into recovery, compliance, and impact tracking.
            </p>
            <ul className="space-y-2.5">
              {[
                'A consistent path from screening result to recycling action',
                'Certified partner routing for non-viable batteries',
                'Cleaner circularity reporting for operators and partners',
                'Less battery waste lost in informal disposal paths',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-sm text-[#222222]">
                  <CheckCircle size={16} className="text-bright-green shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4 text-white"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to run your battery workflow on one platform?</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Bring screening, inventory decisions, marketplace readiness, and circular recovery together with ReVoltz.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-deep-blue font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Get Started
              <ArrowRight size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Learn About ReVoltz
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
