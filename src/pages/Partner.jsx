import { useState } from 'react';
import {
  ArrowRight, BarChart3, BriefcaseBusiness, Building2, ChartColumnBig,
  CheckCircle, Cpu, Headphones, Recycle, ShieldCheck, Smartphone, Users, Wrench,
} from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useToast } from '../hooks/useToast';

const PARTNER_TYPES = [
  {
    icon: Wrench,
    title: 'Workshop Owners',
    desc: 'EV repair workshops looking to expand battery services and revenue streams.',
    bullets: ['AI assessment tools', 'Inventory management', 'Marketplace access', 'Technical support'],
  },
  {
    icon: Recycle,
    title: 'Battery Refurbishers',
    desc: 'Specialists in battery repair, repacking, and second-life applications.',
    bullets: ['Quality verification', 'Pricing intelligence', 'B2B marketplace', 'Certification support'],
  },
  {
    icon: Building2,
    title: 'Recycling Partners',
    desc: 'Certified recyclers handling end-of-life battery material recovery.',
    bullets: ['Lead generation', 'Logistics support', 'Compliance tracking', 'Volume guarantees'],
  },
];

const REVENUE_STATS = [
  { icon: Users, value: '200%', label: 'Average revenue increase', color: 'bg-gradient-to-br from-[#62DB88] to-[#8DE56B]' },
  { icon: ArrowRight, value: 'Rp 85M', label: 'Avg. annual partnership value', color: 'bg-gradient-to-br from-[#244F93] to-[#335FA8]' },
  { icon: BriefcaseBusiness, value: '1,500+', label: 'New customers per month', color: 'bg-gradient-to-br from-[#8FE7B2] to-[#44CE7F]' },
  { icon: ChartColumnBig, value: '45%', label: 'Higher profit margins', color: 'bg-gradient-to-br from-[#A7ED69] to-[#7DDD6A]' },
];

const BENEFITS = [
  {
    icon: Cpu,
    title: 'AI-Powered Tools',
    desc: 'Access cutting-edge battery assessment technology that previously required expensive equipment and expertise.',
  },
  {
    icon: BarChart3,
    title: 'Data & Analytics',
    desc: 'Real-time dashboards showing inventory, revenue, market trends, and performance metrics.',
  },
  {
    icon: Users,
    title: 'Customer Network',
    desc: 'Instant access to thousands of EV owners and businesses looking for battery services.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust & Verification',
    desc: 'Verified partner badge increases customer confidence and conversion rates.',
  },
  {
    icon: Smartphone,
    title: 'Easy Integration',
    desc: 'Simple onboarding process with mobile and web dashboards. No technical expertise needed.',
  },
  {
    icon: Headphones,
    title: 'Growth Support',
    desc: 'Dedicated account managers, training programs, and marketing support to scale your business.',
  },
];

const INITIAL_FORM = {
  businessName: '',
  contactPerson: '',
  email: '',
  phone: '',
  partnerType: '',
  location: '',
  notes: '',
};

function Field({ label, name, value, onChange, placeholder, textarea = false }) {
  if (textarea) {
    return (
      <div>
        <label className="block text-xs font-semibold text-deep-blue mb-1.5">{label}</label>
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-[#D7D7D7] bg-white text-sm outline-none transition-all focus:border-deep-blue focus:ring-2 focus:ring-blue-100 resize-none"
        />
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-deep-blue mb-1.5">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border border-[#D7D7D7] bg-white text-sm outline-none transition-all focus:border-deep-blue focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

export default function Partner() {
  const [form, setForm] = useState(INITIAL_FORM);
  const { showToast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const scrollToForm = () => {
    document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleMockSubmit = (e) => {
    e.preventDefault();
    showToast({ message: 'Partnership form is a mockup for now. No backend is connected yet.', type: 'info' });
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-white">
      <Header />

      <section
        className="relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute left-[-5rem] bottom-[-4rem] h-56 w-56 rounded-full bg-[#ACEA63]/20 blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-8 pt-16 pb-24 sm:pt-20 sm:pb-28 text-center">
          <h1 className="text-[clamp(2.7rem,6vw,5rem)] font-bold tracking-[-0.04em] leading-[0.98] mb-4">
            Partner With ReVoltz
          </h1>
          <p className="text-white/82 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Join Indonesia&apos;s leading battery circular economy platform.
          </p>
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-white text-deep-blue font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Become a Partner
          </button>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">Who Can Partner?</h2>
            <p className="text-dark-gray text-sm sm:text-base">Join our growing network of industry leaders.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {PARTNER_TYPES.map(({ icon: Icon, title, desc, bullets }) => (
              <div key={title} className="rounded-[22px] border border-[#E8E8E8] bg-white p-6 shadow-sm">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
                  <Icon size={24} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold text-[#222222] mb-3">{title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed mb-5">{desc}</p>
                <div className="space-y-2">
                  {bullets.map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-dark-gray">
                      <CheckCircle size={16} className="text-bright-green shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light-gray py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">Revenue Opportunities</h2>
            <p className="text-dark-gray text-sm sm:text-base">Unlock new income streams with ReVoltz.</p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {REVENUE_STATS.map(({ icon: Icon, value, label, color }) => (
              <div key={label} className={`rounded-[20px] p-6 text-white shadow-sm ${color}`}>
                <Icon size={26} className="mb-4 opacity-95" aria-hidden="true" />
                <p className="text-4xl font-bold mb-2">{value}</p>
                <p className="text-sm text-white/80 leading-relaxed">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">Platform Benefits</h2>
            <p className="text-dark-gray text-sm sm:text-base">What partners gain by joining the ReVoltz ecosystem.</p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-[20px] border border-[#E8E8E8] bg-white p-6 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#ECFBF2] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-bright-green" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-[#222222] mb-2">{title}</h3>
                <p className="text-sm text-dark-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner-form" className="bg-light-gray py-16 px-4">
        <div className="max-w-5xl mx-auto rounded-[28px] border border-[#E8E8E8] bg-white p-6 sm:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#222222] mb-3">Ready to Partner?</h2>
            <p className="text-dark-gray text-sm sm:text-base">
              Join 320+ workshops already transforming their battery business.
            </p>
          </div>

          <form onSubmit={handleMockSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Business Name"
                name="businessName"
                value={form.businessName}
                onChange={handleChange}
                placeholder="Your workshop name"
              />
              <Field
                label="Contact Person"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                placeholder="Your full name"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
              />
              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+62 xx xxxx xxxx"
              />
            </div>

            <Field
              label="Partner Type"
              name="partnerType"
              value={form.partnerType}
              onChange={handleChange}
              placeholder="Workshop owner, recycler, refurbisher, etc."
            />

            <Field
              label="City/Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Jakarta, Surabaya, etc."
            />

            <Field
              label="Tell us about your business"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Describe your current operations, monthly battery volume, and why you want to partner with ReVoltz."
              textarea
            />

            <button
              type="submit"
              className="w-full py-4 rounded-full bg-bright-green text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Submit Partnership Request
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
