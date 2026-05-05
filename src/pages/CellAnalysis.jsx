import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Cpu, ScanSearch } from 'lucide-react';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import WorkshopHeader from '../components/layout/WorkshopHeader';
import CellInputForm from '../components/forms/CellInputForm';
import CellCompatibilityMatrix from '../components/specialty/CellCompatibilityMatrix';
import PackAssemblyRecommendation from '../components/specialty/PackAssemblyRecommendation';
import { useAnalysisStore } from '../store/analysisStore';
import { useToast } from '../hooks/useToast';
import api from '../utils/api';

const MODEL_API_BASE = import.meta.env.VITE_MODEL_API_BASE_URL || 'http://localhost:8001';

function SummaryBar({ summary }) {
  const stats = [
    { label: 'Total Cells',    value: summary.total_cells },
    { label: 'Outliers',       value: summary.outlier_count },
    { label: 'Valid for Repack', value: summary.valid_for_repack },
    { label: 'Clusters',       value: summary.clusters_found },
    { label: 'Repack Rate',    value: `${Math.round(summary.repack_rate * 100)}%` },
    { label: 'Packs Found',    value: summary.recommended_pack_count },
  ];
  return (
    <dl className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-sm">
      {stats.map(({ label, value }) => (
        <div key={label} className="text-center">
          <dt className="text-[#AAAAAA] text-xs font-semibold uppercase tracking-wide">{label}</dt>
          <dd className="text-deep-blue font-bold text-lg mt-0.5">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function CellAnalysis() {
  const location = useLocation();
  const { showToast } = useToast();
  const { packResults, setCellData, setCellResults } = useAnalysisStore();

  const packResult = location.state?.packResult ?? packResults;
  const batteryId = location.state?.batteryId ?? null;

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [results,  setResults]  = useState(null);

  const handleSubmit = async ({ cells, assembly_request }) => {
    setLoading(true);
    setError(null);
    setCellData(cells);

    try {
      const response = await fetch(`${MODEL_API_BASE}/predict-cells`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ cells, assembly_request }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(errBody.detail || `Request failed — status ${response.status}`);
      }

      const data = await response.json();
      setResults(data);
      setCellResults(data);
      if (batteryId) {
        try {
          await api.post(`/inventory/${batteryId}/cell-analysis`, {
            analysis_result: data,
          });
        } catch (saveErr) {
          showToast({
            message: saveErr.response?.data?.detail || 'Cell analysis ran, but saving to inventory failed.',
            type: 'error',
            duration: 6000,
          });
        }
      }
      showToast({ message: `Analyzed ${data.summary.total_cells} cells successfully!`, type: 'success' });
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
    setError(null);
  };

  return (
    <div className="min-h-screen bg-light-gray">
      <WorkshopHeader />

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {!results && !loading && (
          <section className="grid md:grid-cols-2 gap-4">
            <div className="rounded-[24px] bg-white border border-[#D7D7D7] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-light-gray flex items-center justify-center">
                  <ScanSearch size={20} className="text-deep-blue" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-bright-green">Step 1</p>
                  <h1 className="text-lg font-bold text-deep-blue">Pack-Level Scan</h1>
                </div>
              </div>
              <p className="text-sm text-dark-gray leading-relaxed">
                Completed first. Model 1 estimated battery SoH and recommended the next action based on pack metrics.
              </p>
            </div>

            <div className="rounded-[24px] p-6 text-white shadow-sm"
              style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                  <Cpu size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-soft-mint">Step 2</p>
                  <h2 className="text-lg font-bold">Cell-Level Scan</h2>
                </div>
              </div>
              <p className="text-sm text-white/82 leading-relaxed">
                Continue with Model 2 to identify compatible cells, detect outliers, and build safe repack groups from detailed cell measurements.
              </p>
            </div>
          </section>
        )}

        {/* Error */}
        {error && !loading && (
          <div>
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

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Spinner size="lg" color="bright-green" />
            <p className="text-dark-gray font-semibold text-lg">Analyzing cell compatibility…</p>
            <p className="text-sm text-[#AAAAAA]">Clustering and scoring cells</p>
          </div>
        )}

        {/* Form */}
        {!loading && !results && (
          <Card variant="default" padding="lg" className="border border-[#D7D7D7]">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
              <div>
                <h2 className="text-2xl font-bold text-deep-blue mb-1">Cell-Level Analysis</h2>
                <p className="text-sm text-dark-gray leading-relaxed">
                  Input cell internal resistance and OCV to run Model 2 compatibility analysis.
                </p>
              </div>
              {packResult && (
                <div className="rounded-full bg-light-gray px-4 py-2 text-sm text-dark-gray">
                  Pack SoH {(packResult.predicted_soh * 100).toFixed(1)}% ready for deeper analysis
                </div>
              )}
            </div>
            <CellInputForm
              onSubmit={handleSubmit}
              isLoading={loading}
              initialPackResult={packResult}
            />
          </Card>
        )}

        {/* Results */}
        {!loading && results && (
          <>
            {/* Summary */}
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-lg font-bold text-deep-blue">Analysis Summary</h2>
                <button
                  onClick={handleReset}
                  className="text-sm text-dark-gray hover:text-deep-blue font-medium transition-colors"
                >
                  ← Analyze More Cells
                </button>
              </div>
              <SummaryBar summary={results.summary} />
            </Card>

            {/* Compatibility matrix */}
            <Card variant="default" padding="md">
              <h2 className="text-lg font-bold text-deep-blue mb-4">Cell Compatibility</h2>
              <CellCompatibilityMatrix results={results.results} />
            </Card>

            {/* Pack recommendations */}
            {results.recommended_packs && results.recommended_packs.length > 0 && (
              <Card variant="default" padding="md">
                <h2 className="text-lg font-bold text-deep-blue mb-4">
                  Pack Assembly Recommendations
                  <span className="ml-2 text-sm font-normal text-dark-gray">
                    ({results.recommended_packs.length} pack{results.recommended_packs.length !== 1 ? 's' : ''})
                  </span>
                </h2>
                <PackAssemblyRecommendation packs={results.recommended_packs} />
              </Card>
            )}

            {results.recommended_packs && results.recommended_packs.length === 0 && (
              <Card variant="outlined" padding="md">
                <p className="text-sm text-dark-gray">
                  No pack recommendations could be generated. This may be because all cells are outliers or the requested pack size exceeds the number of compatible cells.
                </p>
              </Card>
            )}

            <div className="rounded-[20px] border border-[#D7D7D7] bg-white p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-light-gray flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-bright-green" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-deep-blue mb-1">Cell-level recommendations are ready.</p>
                  <p className="text-sm text-dark-gray leading-relaxed">
                    Use this output for repack planning and workshop decisions. Inventory detail can later surface both pack-level and cell-level analysis together for each battery.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default CellAnalysis;
