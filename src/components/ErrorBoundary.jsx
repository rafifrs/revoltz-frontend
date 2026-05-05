import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-light-gray flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle size={64} className="text-red-400 mb-6" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-deep-blue mb-2">Something went wrong</h1>
          <p className="text-dark-gray text-sm mb-8 max-w-sm">
            An unexpected error occurred. Please reload the page or contact support if the problem persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-bright-green text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
