import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Zap, Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const NAV_LINKS = [
  { label: 'Product',     href: '/product'     },
  { label: 'Marketplace', href: '/marketplace'  },
  { label: 'Partner',     href: '/partner'      },
  { label: 'About',       href: '/about'        },
];

const AUTH_STATES = {
  GUEST: 'guest',
  CUSTOMER: 'customer',
  WORKSHOP: 'workshop',
};

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuState,    setMenuState]    = useState({ open: false, pathname: location.pathname });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    showToast({ message: 'You have been logged out.', type: 'info' });
    navigate('/login');
    setDropdownOpen(false);
  };

  const authState = !isAuthenticated
    ? AUTH_STATES.GUEST
    : user?.role === 'workshop'
      ? AUTH_STATES.WORKSHOP
      : AUTH_STATES.CUSTOMER;

  const visibleNavLinks = authState === AUTH_STATES.CUSTOMER
    ? NAV_LINKS.filter(({ href }) => href === '/marketplace')
    : NAV_LINKS;

  const dashboardPath = authState === AUTH_STATES.WORKSHOP ? '/workshop-dashboard' : '/marketplace';
  const primaryActionLabel = authState === AUTH_STATES.WORKSHOP ? 'Dashboard' : 'Marketplace';
  const profileActionLabel = authState === AUTH_STATES.WORKSHOP ? 'Dashboard' : 'Marketplace';
  const menuOpen = menuState.open && menuState.pathname === location.pathname;

  const closeMenu = () => {
    setMenuState({ open: false, pathname: location.pathname });
    setDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuState((state) => (
      state.open && state.pathname === location.pathname
        ? { open: false, pathname: location.pathname }
        : { open: true, pathname: location.pathname }
    ));
  };

  const isActive = (href) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <header className="bg-white border-b border-[#AAAAAA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Zap size={22} className="text-bright-green" aria-hidden="true" />
          <span className="text-xl font-bold text-deep-blue">ReVoltz</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {visibleNavLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                to={href}
                className={[
                  'relative px-3.5 py-1.5 text-sm font-medium rounded-lg transition-colors',
                  active
                    ? 'text-deep-blue'
                    : 'text-dark-gray hover:text-deep-blue hover:bg-light-gray',
                ].join(' ')}
              >
                {label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-bright-green rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {isAuthenticated ? (
            <>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-light-gray transition-colors text-sm font-medium text-deep-blue"
                >
                  <div className="w-7 h-7 rounded-full bg-bright-green flex items-center justify-center text-white text-xs font-bold">
                    {user?.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.full_name}</span>
                  <ChevronDown size={14} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-[#AAAAAA] shadow-lg py-1 z-50">
                    <button
                      onClick={() => { navigate(dashboardPath); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#222222] hover:bg-light-gray"
                    >
                      <User size={14} /> {profileActionLabel}
                    </button>
                    <button
                      onClick={() => { showToast({ message: 'Settings coming soon!', type: 'info' }); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#222222] hover:bg-light-gray"
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <hr className="border-[#AAAAAA] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(dashboardPath)}
                className="px-4 py-2 text-sm font-semibold bg-deep-blue text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                {primaryActionLabel}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-semibold text-deep-blue hover:bg-light-gray rounded-lg transition-colors">
                Login
              </Link>
              <Link to="/register" className="px-4 py-2 text-sm font-semibold bg-bright-green text-white rounded-lg hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-lg text-dark-gray hover:bg-light-gray transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-[#AAAAAA] px-4 py-4 space-y-1">
          {visibleNavLinks.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                to={href}
                onClick={closeMenu}
                className={[
                  'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                  active ? 'text-deep-blue bg-light-gray font-semibold' : 'text-dark-gray hover:text-deep-blue hover:bg-light-gray',
                ].join(' ')}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-bright-green mr-2 shrink-0" />}
                {label}
              </Link>
            );
          })}
          <hr className="border-[#AAAAAA] my-2" />
          {isAuthenticated ? (
            <>
              <button
                onClick={() => { navigate(dashboardPath); closeMenu(); }}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-deep-blue hover:bg-light-gray rounded-lg"
              >
                {primaryActionLabel}
              </button>
              <button
                onClick={() => { closeMenu(); handleLogout(); }}
                className="w-full text-left px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" onClick={closeMenu} className="flex-1 text-center py-2.5 text-sm font-semibold text-deep-blue border border-deep-blue rounded-lg hover:bg-light-gray transition-colors">Login</Link>
              <Link to="/register" onClick={closeMenu} className="flex-1 text-center py-2.5 text-sm font-semibold text-white bg-bright-green rounded-lg hover:opacity-90 transition-opacity">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
