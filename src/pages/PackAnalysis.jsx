import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Cpu, ScanSearch } from 'lucide-react';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import WorkshopHeader from '../components/layout/WorkshopHeader';
import PackInputForm from '../components/forms/PackInputForm';
import PackResultCard from '../components/specialty/PackResultCard';
import { useAnalysisStore } from '../store/analysisStore';
import { useToast } from '../hooks/useToast';
import api from '../utils/api';

const MODEL_API_BASE = import.meta.env.VITE_MODEL_API_BASE_URL || 'http://localhost:8001';

function PackAnalysis() {
  const [results, setResults] = useState(null);
  const [savedBattery, setSavedBattery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const navigate    = useNavigate();
  const { showToast } = useToast();
  const { setPackData, setPackResults } = useAnalysisStore();

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setPackData(formData);

    try {
      const response = await fetch(`${MODEL_API_BASE}/predict-pack`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ packs: [formData] }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed — status ${response.status}`);
      }

      const data = await response.json();
      const firstResult = data.results?.[0];
      if (!firstResult) throw new Error('No results returned from the Model API.');

      setResults(firstResult);
      setPackResults(firstResult);
      try {
        const inventoryRes = await api.post('/inventory/pack-scan', {
          pack_data: formData,
          pack_result: firstResult,
        });
        setSavedBattery(inventoryRes.data.battery);
        showToast({ message: 'Battery analysis complete and saved to inventory!', type: 'success' });
      } catch (saveErr) {
        setSavedBattery(null);
        showToast({
          message: saveErr.response?.data?.detail || 'Analysis complete, but inventory save failed.',
          type: 'error',
          duration: 6000,
        });
      }
    } catch (err) {
      const msg = err.message || 'Analysis failed. Is the Model API running on port 8001?';
      setError(msg);
      showToast({ message: msg, type: 'error', duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setSavedBattery(null);
    setError(null);
  };

  const handleAnalyzeFurther = () => {
    navigate('/cell-analysis', { state: { packResult: results, batteryId: savedBattery?.id } });
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <WorkshopHeader />

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {!results && !loading && (
          <section
            className="rounded-[28px] p-8 text-white overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-soft-mint mb-4">AI Scan Workspace</p>
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">Start with a pack-level battery scan.</h1>
              <p className="text-white/82 text-sm sm:text-base max-w-3xl leading-relaxed mb-6">
                This is the first of two workshop analysis levels. Run Model 1 on pack measurements to estimate battery health, then continue to cell-level matching only when deeper repack analysis is needed.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="rounded-[20px] bg-white/10 border border-white/15 p-5 backdrop-blur">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <ScanSearch size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-soft-mint">Step 1</p>
                      <h2 className="font-bold text-lg">Pack-Level Scan</h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Measure pack OCV, capacity, cycle count, and temperature to generate SoH, confidence, and recommended action.
                  </p>
                </div>
                <div className="rounded-[20px] bg-black/10 border border-white/15 p-5 backdrop-blur">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                      <Cpu size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-soft-mint">Step 2</p>
                      <h2 className="font-bold text-lg">Cell-Level Scan</h2>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">
                    If the pack is worth repacking, continue with cell OCV and IR data to detect outliers and generate assembly recommendations.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Error state ───────────────────────────────────── */}
        {error && !loading && (
          <div className="mb-4">
            <Alert
              type="error"
              title="Analysis Failed"
              message={error}
              dismissible
              onDismiss={() => setError(null)}
            />
            <Button variant="secondary" size="sm" onClick={handleReset}>
              ← Try Again
            </Button>
          </div>
        )}

        {/* ── Loading state ─────────────────────────────────── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold text-lg">Analyzing battery health…</p>
            <p className="text-sm text-[#AAAAAA]">This usually takes 2 – 5 seconds</p>
          </div>
        )}

        {/* ── Form ──────────────────────────────────────────── */}
        {!loading && !results && (
          <PackInputForm
            onSubmit={handleSubmit}
            isLoading={loading}
            onCancel={() => navigate('/workshop-dashboard')}
          />
        )}

        {/* ── Results ───────────────────────────────────────── */}
        {!loading && results && (
          <>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p className="text-sm text-dark-gray">
                Pack ID:{' '}
                <span className="font-mono text-deep-blue">{results.pack_id}</span>
              </p>
              <button
                onClick={handleReset}
                className="text-sm text-dark-gray hover:text-deep-blue font-medium transition-colors"
              >
                ← Scan Another Battery
              </button>
            </div>
            <PackResultCard
              data={results}
              onBack={handleReset}
              onAnalyzeFurther={handleAnalyzeFurther}
            />
            <div className="rounded-[20px] border border-[#D7D7D7] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-bright-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-deep-blue mb-1">Pack-level result is complete.</p>
                  <p className="text-sm text-dark-gray leading-relaxed">
                    If you want to validate cell compatibility for repack decisions, continue to the second scan level. Otherwise, you can review or manage this battery in inventory after saving it to your workflow later.
                  </p>
                </div>
              </div>
            </div>
            {savedBattery && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(`/inventory/${savedBattery.id}`)}
                  className="text-sm font-semibold text-bright-green hover:underline"
                >
                  View saved battery detail →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PackAnalysis;
