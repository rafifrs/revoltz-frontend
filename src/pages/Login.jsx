import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

function Login() {
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const navigate     = useNavigate();
  const { login }    = useAuth();
  const { showToast} = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password)      errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ve = validate();
    if (Object.keys(ve).length) { setErrors(ve); return; }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      showToast({ message: `Welcome back, ${data.user.full_name}!`, type: 'success' });
      navigate(data.user.role === 'workshop' ? '/workshop-dashboard' : '/marketplace');
    } catch (err) {
      const message = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      showToast({ message, type: 'error' });
      setErrors({ password: ' ' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — gradient */}
      <div
        className="hidden lg:flex flex-col justify-between w-1/2 p-12 text-white"
        style={{ background: 'linear-gradient(155deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-white" />
          <span className="text-xl font-bold">ReVoltz</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4 leading-tight">
            Indonesia's AI-powered<br />battery lifecycle platform
          </h2>
          <p className="text-white/70 text-sm leading-relaxed">
            Join 12,500+ customers and 320+ workshops transforming how second-life EV batteries are assessed, priced, and traded.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { v: '450K+',  l: 'Batteries assessed'  },
              { v: '320+',   l: 'Active workshops'     },
              { v: '50K+',   l: 'Tons CO2 saved'       },
              { v: '4.8/5',  l: 'Customer rating'      },
            ].map(({ v, l }) => (
              <div key={l} className="bg-white/10 rounded-xl p-3">
                <p className="text-xl font-bold">{v}</p>
                <p className="text-white/60 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">2025 ReVoltz. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 py-10 bg-light-gray">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <Zap size={20} className="text-bright-green" />
          <span className="text-lg font-bold text-deep-blue">ReVoltz</span>
        </div>

        <div className="w-full max-w-sm mx-auto">
          <h1 className="text-2xl font-bold text-deep-blue mb-1">Sign in</h1>
          <p className="text-dark-gray text-sm mb-8">Welcome back — enter your credentials below.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-deep-blue mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className={[
                    'w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white',
                    errors.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-[#AAAAAA] focus:border-deep-blue focus:ring-2 focus:ring-blue-100',
                  ].join(' ')}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-deep-blue uppercase tracking-wide">Password</label>
                <button
                  type="button"
                  onClick={() => showToast({ message: 'Password reset coming soon!', type: 'info' })}
                  className="text-xs text-dark-gray hover:text-deep-blue transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                  autoComplete="current-password"
                  className={[
                    'w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all bg-white',
                    errors.password && errors.password.trim()
                      ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                      : 'border-[#AAAAAA] focus:border-deep-blue focus:ring-2 focus:ring-blue-100',
                  ].join(' ')}
                />
              </div>
              {errors.password && errors.password.trim() && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-bright-green text-white font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-dark-gray mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-deep-blue font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
