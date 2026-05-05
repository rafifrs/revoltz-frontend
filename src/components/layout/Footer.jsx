import { Link } from 'react-router-dom';
import { Zap, Globe, ExternalLink, Mail } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { label: 'Platform Overview', href: '/product' },
      { label: 'AI Assessment',     href: '/product' },
      { label: 'Marketplace',       href: '/marketplace' },
      { label: 'Get Started',       href: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us',         href: '/about' },
      { label: 'Our Mission',      href: '/about' },
      { label: 'Team',             href: '/about' },
      { label: 'Become a Partner', href: '/partner' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Landing Page',  href: '/' },
      { label: 'Login',         href: '/login' },
      { label: 'Marketplace',   href: '/marketplace' },
      { label: 'About ReVoltz', href: '/about' },
    ],
  },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Brand column */}
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={22} className="text-bright-green" aria-hidden="true" />
              <span className="text-xl font-bold">ReVoltz</span>
            </div>
            <p className="text-sm text-[#9BE8A8] leading-relaxed mb-6 max-w-xs">
              Transforming Indonesia's EV battery ecosystem through AI-driven assessment, marketplace, and circular economy solutions.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { Icon: Globe,        label: 'LinkedIn'   },
                { Icon: ExternalLink, label: 'Twitter'    },
                { Icon: Mail,         label: 'Newsletter' },
              ].map(({ Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-white border-opacity-20 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <Icon size={16} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-[#9BE8A8] hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 pt-8 border-t border-white border-opacity-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-semibold mb-1">Stay updated</p>
              <p className="text-xs text-[#9BE8A8]">Get the latest news on EV battery innovation.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 text-white placeholder-[#9BE8A8] focus:outline-none focus:border-bright-green"
                />
              </div>
              <button className="px-4 py-2.5 text-sm font-semibold bg-bright-green text-white rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white border-opacity-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#9BE8A8]">
          <p>{year} ReVoltz. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-white transition-colors">About</Link>
            <Link to="/product" className="hover:text-white transition-colors">Product</Link>
            <Link to="/partner" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
