import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ScanLine, Zap } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

function Dashboard() {
  const { user, logout } = useAuth();
  const { showToast }    = useToast();
  const navigate         = useNavigate();

  useEffect(() => {
    if (user?.role === 'workshop') navigate('/workshop-dashboard', { replace: true });
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    showToast({ message: 'You have been logged out.', type: 'info' });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-light-gray">
      {/* Header */}
      <header className="bg-white border-b border-[#AAAAAA] px-6 h-16 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Zap size={22} className="text-bright-green" aria-hidden="true" />
          <span className="text-xl font-bold text-deep-blue">ReVoltz</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut size={16} className="mr-1" aria-hidden="true" />
          Logout
        </Button>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Welcome card */}
        <Card variant="default" padding="lg">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-deep-blue mb-1">
                Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
              </h2>
              <p className="text-dark-gray text-sm">{user?.email}</p>
            </div>
            <Badge variant={user?.role === 'workshop' ? 'info' : 'success'} size="md">
              {user?.role === 'workshop' ? 'Workshop' : 'Customer'}
            </Badge>
          </div>
        </Card>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card variant="elevated" padding="md" clickable onClick={() => navigate('/pack-analysis')}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bright-green bg-opacity-15 flex items-center justify-center shrink-0">
                <ScanLine size={24} className="text-bright-green" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-deep-blue">New Battery Scan</h3>
                <p className="text-sm text-dark-gray mt-0.5">Predict SoH using AI model</p>
              </div>
            </div>
          </Card>

          <Card variant="default" padding="md" className="opacity-60">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-soft-mint bg-opacity-40 flex items-center justify-center shrink-0">
                <Zap size={24} className="text-deep-blue" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-deep-blue">Inventory</h3>
                <p className="text-sm text-dark-gray mt-0.5">Coming in Phase 5</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Workshop info */}
        {user?.role === 'workshop' && user?.workshop_name && (
          <Card variant="outlined" padding="md">
            <h3 className="text-base font-semibold text-deep-blue mb-1">{user.workshop_name}</h3>
            <p className="text-sm text-dark-gray">Full workshop dashboard coming in Phase 5.</p>
          </Card>
        )}

        {/* Session info */}
        <Card variant="default" padding="md">
          <h3 className="text-sm font-semibold text-deep-blue mb-3">Session</h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <dt className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">User ID</dt>
              <dd className="text-[#222222] font-mono mt-0.5">{user?.id ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">Role</dt>
              <dd className="capitalize mt-0.5">{user?.role ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">Email</dt>
              <dd className="mt-0.5 truncate">{user?.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">Token</dt>
              <dd className="text-bright-green font-semibold mt-0.5">
                {localStorage.getItem('revoltz_access_token') ? '✓ Stored' : '✗ Missing'}
              </dd>
            </div>
          </dl>
        </Card>
      </main>
    </div>
  );
}

export default Dashboard;
