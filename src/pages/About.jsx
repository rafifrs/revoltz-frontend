import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Battery, Cpu, Globe, Leaf, Recycle,
  ShoppingBag, TrendingUp, Users, Zap,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const WHY_NOW = [
  {
    icon: TrendingUp,
    title: 'EV adoption is accelerating',
    desc: 'More electric vehicles mean more batteries entering second-life and end-of-life flows over the next decade.',
  },
  {
    icon: Zap,
    title: 'Battery value is still being lost',
    desc: 'Good packs are scrapped too early because workshops and buyers lack fast, trusted health intelligence.',
  },
  {
    icon: Globe,
    title: 'Circular infrastructure is still fragmented',
    desc: 'Assessment, resale, and recycling often live in separate workflows, making traceability and compliance harder.',
  },
];

const VALUES = [
  {
    icon: Cpu,
    title: 'Trust through data',
    desc: 'Every recommendation starts with measurable battery condition, not guesswork.',
    color: 'bg-deep-blue text-white',
  },
  {
    icon: ShoppingBag,
    title: 'Value through reuse',
    desc: 'Healthy batteries should be repurposed and sold into the right second-life use case.',
    color: 'bg-soft-mint text-deep-blue',
  },
  {
    icon: Recycle,
    title: 'Responsibility through recovery',
    desc: 'When packs truly reach end of life, they should be routed to certified recycling partners.',
    color: 'bg-bright-green text-white',
  },
];

const CIRCULAR_FLOW = [
  { icon: Battery, title: 'Battery enters the system', desc: 'Used EV packs arrive from workshops, fleets, and owners.' },
  { icon: Cpu, title: 'AI health screening', desc: 'ReVoltz predicts SoH and recommends repack, resale, or recycling.' },
  { icon: ShoppingBag, title: 'Second-life distribution', desc: 'Qualified packs are listed with verified battery data.' },
  { icon: Recycle, title: 'Responsible recovery', desc: 'Non-viable batteries move into tracked recycling workflows.' },
];

const TEAM = [
  { name: 'Rafif Farras', role: 'Software Engineer', initial: 'RF', color: 'bg-deep-blue', photo: 'rafif.jpg' },
  { name: 'Guntara Hambali', role: 'AI Engineer', initial: 'GH', color: 'bg-bright-green', photo: 'gun.png' },
  { name: 'Wijaksara Aptaluhung', role: 'Product', initial: 'WA', color: 'bg-soft-mint', photo: 'wij.png' },
  { name: 'Allodya Arofa', role: 'UI/UX Designer', initial: 'AA', color: 'bg-lime-green', photo: 'ody.jpg' },
];

const MILESTONES = [
  {
    date: 'Research phase',
    title: 'Mapped the battery lifecycle gap',
    desc: 'We started by understanding why usable batteries were being undervalued and why recycling was still disconnected from workshop operations.',
  },
  {
    date: 'Platform build',
    title: 'Connected AI, marketplace, and recycling',
    desc: 'Instead of solving only one part of the problem, we built a system where battery assessment informs every downstream decision.',
  },
  {
    date: 'MVP launch · May 5, 2026',
    title: 'Released the first ReVoltz experience',
    desc: 'The MVP brings fast battery screening, marketplace readiness, and circular routing into one workflow for Indonesia.',
  },
];

export default function About() {
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
          <div className="absolute left-[-5rem] bottom-0 h-56 w-56 rounded-full bg-[#ACEA63]/20 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pt-14 pb-20 sm:pt-16 sm:pb-24 lg:pt-12 lg:pb-20">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur mb-6">
              <Users size={16} className="text-soft-mint" aria-hidden="true" />
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-white/90">
                About ReVoltz
              </span>
            </div>

            <h1 className="text-[clamp(2.8rem,6vw,5.5rem)] font-bold leading-[0.96] tracking-[-0.04em] mb-5 max-w-4xl">
              Building the operating system for Indonesia&apos;s battery circular economy.
            </h1>
            <p className="text-white/82 text-base sm:text-lg max-w-2xl leading-relaxed mb-8">
              ReVoltz exists to help every used EV battery reach the right next step: reuse when it is valuable, resale when it is ready, and recycling when it is necessary.
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4 mb-8">
              <button
                onClick={() => navigate('/product')}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-deep-blue font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                Explore the Platform
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Join ReVoltz
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
              {[
                { value: '30s', label: 'AI health screening' },
                { value: '1', label: 'Connected resale-to-recycling workflow' },
                { value: '100%', label: 'Focus on circular battery outcomes' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-[18px] border border-white/15 bg-black/10 p-4 backdrop-blur">
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-white/72 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-stretch">
          <div className="rounded-[28px] bg-light-gray p-8 sm:p-10 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-bright-green mb-4">Why We Exist</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-deep-blue leading-tight mb-4 max-w-xl">
              Indonesia needs a better path for used EV batteries.
            </h2>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed max-w-2xl mb-5">
              The country&apos;s EV future depends on what happens after the first battery life ends. Without trusted screening and routing, workshops lose value, buyers lose confidence, and recyclable material gets stuck in informal channels.
            </p>
            <p className="text-dark-gray text-sm sm:text-base leading-relaxed max-w-2xl mb-8">
              ReVoltz connects those decisions into one operational flow so data, commerce, and sustainability reinforce each other instead of competing.
            </p>

            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { icon: Cpu, title: 'Faster decisions', desc: 'Health data becomes operational, not just informational.' },
                { icon: ShoppingBag, title: 'Better resale trust', desc: 'Buyers get clearer visibility before they commit.' },
                { icon: Recycle, title: 'Cleaner circular routing', desc: 'Non-viable batteries move into responsible recovery.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-[20px] bg-white p-5 border border-[#E6E6E6]">
                  <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center mb-3">
                    <Icon size={18} className="text-deep-blue" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-deep-blue mb-1.5">{title}</h3>
                  <p className="text-xs text-dark-gray leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 content-start">
            <div className="rounded-[24px] bg-deep-blue text-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-soft-mint mb-3">What ReVoltz Stands For</p>
              <p className="text-sm sm:text-base text-white/82 leading-relaxed">
                We&apos;re not building a single battery tool. We&apos;re building the decision layer that ties assessment, commerce, and recovery into one system.
              </p>
            </div>

            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className={`rounded-[22px] p-6 shadow-sm ${color}`}>
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed opacity-85">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">Why Now</h2>
            <p className="text-dark-gray text-sm max-w-2xl mx-auto">
              Three forces make a connected battery lifecycle platform especially urgent right now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {WHY_NOW.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-[22px] p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                  <Icon size={22} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-deep-blue mb-2">{title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-3">How ReVoltz Works</h2>
            <p className="text-dark-gray text-sm max-w-2xl mx-auto">
              The platform is designed to keep every battery moving through the highest-value responsible outcome.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {CIRCULAR_FLOW.map(({ icon: Icon, title, desc }, idx) => (
              <div key={title} className="relative bg-light-gray rounded-[22px] p-6">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm">
                  <Icon size={22} className="text-deep-blue" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-bright-green mb-2">Step {idx + 1}</p>
                <h3 className="text-lg font-bold text-deep-blue mb-2">{title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.95fr_1.05fr] gap-10 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-bright-green mb-4">Team & Journey</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-deep-blue mb-4">A small team building practical infrastructure.</h2>
            <p className="text-dark-gray text-sm leading-relaxed max-w-xl mb-8">
              We are bringing together product, engineering, AI, and design to make battery circularity more operational, more transparent, and easier to adopt for real businesses.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TEAM.map(({ name, role, initial, color, photo }) => (
                <div key={name} className="bg-white rounded-[20px] p-5 text-center shadow-sm">
                  {photo ? (
                    <img
                      src={photo}
                      alt={name}
                      className="w-full h-40 object-cover rounded-[18px] mb-4"
                    />
                  ) : (
                    <div className={`w-full h-40 rounded-[18px] ${color} flex items-center justify-center text-white text-3xl font-bold mb-4`}>
                      {initial}
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-deep-blue leading-tight">{name}</h3>
                  <p className="text-xs text-dark-gray mt-1">{role}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                <Leaf size={20} className="text-bright-green" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-deep-blue">Our Journey</h3>
                <p className="text-sm text-dark-gray">From problem mapping to MVP launch.</p>
              </div>
            </div>

            <div className="relative border-l-2 border-[#D7D7D7] ml-3 space-y-8 pl-8">
              {MILESTONES.map(({ date, title, desc }, idx) => (
                <div key={title} className="relative">
                  <div className={`absolute -left-[2.1rem] w-4 h-4 rounded-full border-4 border-white ${idx === MILESTONES.length - 1 ? 'bg-bright-green' : 'bg-deep-blue'}`} />
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-bright-green mb-1">{date}</p>
                  <h4 className="font-bold text-deep-blue mb-1">{title}</h4>
                  <p className="text-sm text-dark-gray leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-16 px-4 text-white"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Want to build the battery circular economy with us?</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you are a workshop, fleet operator, refurbisher, or ecosystem partner, ReVoltz is built to help you move faster with more confidence.
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
              onClick={() => navigate('/marketplace')}
              className="px-8 py-3.5 border-2 border-white/60 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              View Marketplace
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
