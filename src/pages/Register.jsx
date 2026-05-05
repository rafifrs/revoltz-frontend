import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Phone, Building2, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

const INITIAL_FORM = { full_name: '', email: '', phone: '', password: '', workshop_name: '', address: '' };

function validate(form, role) {
  const errors = {};
  if (!form.full_name.trim())   errors.full_name = 'Full name is required';
  if (!form.email.trim())       errors.email     = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email';
  if (!form.password)           errors.password  = 'Password is required';
  else if (form.password.length < 8) errors.password = 'At least 8 characters';
  if (role === 'workshop' && !form.workshop_name.trim()) errors.workshop_name = 'Workshop name is required';
  return errors;
}

function Field({ icon: Icon, label, name, type = 'text', value, onChange, error, placeholder, helper }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-deep-blue mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name}
          className={[
            'w-full py-3 rounded-xl border text-sm outline-none transition-all bg-white',
            Icon ? 'pl-10 pr-4' : 'px-4',
            error
              ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
              : 'border-[#AAAAAA] focus:border-deep-blue focus:ring-2 focus:ring-blue-100',
          ].join(' ')}
        />
      </div>
      {error  && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helper && !error && <p className="text-xs text-[#AAAAAA] mt-1">{helper}</p>}
    </div>
  );
}

function Register() {
  const [role,    setRole]    = useState('customer');
  const [form,    setForm]    = useState(INITIAL_FORM);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const navigate       = useNavigate();
  const { register }   = useAuth();
  const { showToast }  = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate(form, role);
    if (Object.keys(ve).length) { setErrors(ve); return; }
    setLoading(true);
    try {
      await register({ ...form, role });
      showToast({ message: 'Account created! Please log in.', type: 'success' });
      navigate('/login');
    } catch (err) {
      showToast({ message: err.response?.data?.detail || 'Registration failed.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-5/12 p-12 text-white"
        style={{ background: 'linear-gradient(155deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-white" />
          <span className="text-xl font-bold">ReVoltz</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Start your journey in<br />the battery economy
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Whether you're a workshop looking to monetize batteries or a customer seeking verified second-life packs — ReVoltz connects you.
          </p>
          <div className="mt-8 space-y-3">
            {[
              'Free to join — no hidden fees',
              'AI-verified battery assessments',
              'Trusted marketplace with 12,500+ users',
              'Circular economy impact tracking',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm">
                <div className="w-5 h-5 rounded-full bg-bright-green flex items-center justify-center shrink-0">
                  <ArrowRight size={11} />
                </div>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">2025 ReVoltz. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-10 bg-light-gray overflow-y-auto">
        <div className="lg:hidden flex items-center gap-2 mb-6">
          <Zap size={20} className="text-bright-green" />
          <span className="text-lg font-bold text-deep-blue">ReVoltz</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-deep-blue mb-1">Create account</h1>
          <p className="text-dark-gray text-sm mb-6">Join Indonesia's battery lifecycle platform.</p>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'customer', label: 'Customer',  Icon: User,      sub: 'Browse & buy batteries' },
              { value: 'workshop', label: 'Workshop',  Icon: Building2, sub: 'Analyze & sell batteries' },
            ].map(({ value, label, Icon, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setRole(value); setErrors({}); }}
                className={[
                  'flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all text-center',
                  role === value
                    ? 'border-bright-green bg-green-50 text-deep-blue'
                    : 'border-[#AAAAAA] bg-white text-dark-gray hover:border-deep-blue',
                ].join(' ')}
              >
                <Icon size={22} className={role === value ? 'text-bright-green' : 'text-[#AAAAAA]'} />
                <span className="font-semibold text-sm">{label}</span>
                <span className="text-xs leading-tight opacity-70">{sub}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            <Field icon={User}     label="Full Name"     name="full_name"     value={form.full_name}     onChange={handleChange} error={errors.full_name}     placeholder="Your full name" />
            <Field icon={Mail}     label="Email"         name="email"         type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" />
            <Field icon={Phone}    label="Phone"         name="phone"         type="tel" value={form.phone}  onChange={handleChange} placeholder="+62 xxx xxxx xxxx" />

            {role === 'workshop' && (
              <>
                <Field icon={Building2} label="Workshop Name" name="workshop_name" value={form.workshop_name} onChange={handleChange} error={errors.workshop_name} placeholder="e.g. Bengkel Baterai Bandung" />
                <Field icon={MapPin}    label="Address"       name="address"       value={form.address}       onChange={handleChange} placeholder="Workshop address" />
              </>
            )}

            <Field
              icon={Lock}
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Min. 8 characters"
              helper="At least 8 characters"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark-gray mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-deep-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
