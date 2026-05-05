import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Zap } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/workshop-dashboard', match: (pathname) => pathname === '/workshop-dashboard' },
  { label: 'Scan', href: '/pack-analysis', match: (pathname) => pathname === '/pack-analysis' || pathname === '/cell-analysis' },
  { label: 'Inventory', href: '/inventory', match: (pathname) => pathname === '/inventory' || pathname.startsWith('/inventory/') },
];

function WorkshopHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast({ message: 'You have been logged out.', type: 'info' });
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#D7D7D7] bg-white/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/workshop-dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #244F93, #44CE7F)' }}>
              <Zap size={16} className="text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-deep-blue leading-none">ReVoltz</p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7A7A7A]">Workshop Console</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ label, href, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={label}
                to={href}
                className={[
                  'px-3.5 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors',
                  active
                    ? 'bg-deep-blue text-white'
                    : 'text-dark-gray hover:text-deep-blue hover:bg-light-gray',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Button variant="ghost" size="sm" onClick={handleLogout} className="shrink-0">
          <LogOut size={16} className="mr-1" aria-hidden="true" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default WorkshopHeader;
