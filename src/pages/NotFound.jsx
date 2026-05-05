import { useNavigate } from 'react-router-dom';
import { Battery } from 'lucide-react';
import Button from '../components/ui/Button';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-light-gray flex flex-col items-center justify-center p-6 text-center">
      <Battery size={64} className="text-[#AAAAAA] mb-6" aria-hidden="true" />
      <h1 className="text-3xl font-bold text-deep-blue mb-2">Page Not Found</h1>
      <p className="text-dark-gray text-sm mb-8 max-w-xs">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <Button variant="primary" onClick={() => navigate('/')}>Go Home</Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  );
}

export default NotFound;
