import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Battery } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import BatteryCard from '../components/specialty/BatteryCard';
import MarketplaceFilter from '../components/specialty/MarketplaceFilter';

const API_BASE  = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const PAGE_SIZE = 9;

const DEFAULT_FILTERS = { chemistries: [], sohRanges: [], priceMax: 100_000_000 };

function Marketplace() {
  const [batteries, setBatteries] = useState([]);
  const [filters,   setFilters]   = useState(DEFAULT_FILTERS);
  const [search,    setSearch]    = useState('');
  const [page,      setPage]      = useState(1);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchBatteries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/marketplace`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setBatteries(data.batteries ?? []);
    } catch (err) {
      setError(err.message || 'Failed to load marketplace.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => { fetchBatteries(); }, 0);
    return () => clearTimeout(timer);
  }, [fetchBatteries]);

  const filtered = useMemo(() => {
    return batteries.filter((b) => {
      if (search && !b.model_name.toLowerCase().includes(search.toLowerCase()) &&
          !b.seller_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.chemistries.length && !filters.chemistries.includes(b.chemistry)) return false;
      if (b.price > filters.priceMax) return false;
      if (filters.sohRanges.length) {
        const match = filters.sohRanges.some((r) => b.soh >= r.min && b.soh < r.max);
        if (!match) return false;
      }
      return true;
    });
  }, [batteries, search, filters]);

  const paginated = useMemo(() => filtered.slice(0, page * PAGE_SIZE), [filtered, page]);
  const hasMore   = paginated.length < filtered.length;

  const handleFilterChange = (f) => { setFilters(f); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const clearFilters = () => { setFilters(DEFAULT_FILTERS); setSearch(''); setPage(1); };

  return (
    <div className="min-h-screen flex flex-col bg-light-gray">
      <Header />

      {/* Hero */}
      <section
        className="text-white py-16 px-4"
        style={{ background: 'linear-gradient(135deg, #244F93 0%, #44CE7F 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Battery Marketplace</h1>
          <p className="text-sm sm:text-base text-white text-opacity-90 mb-8">
            Verified second-life batteries with AI-assessed health scores
          </p>
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAAAAA]" />
            <input
              type="text"
              placeholder="Search by battery type, model, or brand..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-4 rounded-xl text-[#222222] text-sm outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 shadow-sm"
              aria-label="Search batteries"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex gap-6 items-start">

          {/* Filter sidebar */}
          <MarketplaceFilter onFilterChange={handleFilterChange} />

          {/* Grid area */}
          <div className="flex-1 min-w-0">
            {/* Count + mobile filter row */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <p className="text-sm text-dark-gray">
                {loading ? 'Loading...' : `Showing ${filtered.length} batter${filtered.length !== 1 ? 'ies' : 'y'}`}
              </p>
              <div className="lg:hidden">
                <MarketplaceFilter onFilterChange={handleFilterChange} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4">
                <Alert type="error" title="Failed to load" message={error} />
                <Button variant="secondary" size="sm" onClick={fetchBatteries} className="mt-2">Retry</Button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Spinner size="lg" color="bright-green" />
                <p className="text-dark-gray text-sm font-semibold">Loading marketplace…</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <Battery size={56} className="text-[#AAAAAA]" strokeWidth={1.2} />
                <h3 className="text-lg font-bold text-deep-blue">No batteries found</h3>
                <p className="text-sm text-dark-gray">Try adjusting your filters or browse all listings.</p>
                <Button variant="secondary" size="sm" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}

            {/* Battery grid */}
            {!loading && !error && filtered.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginated.map((bat) => (
                    <BatteryCard key={bat.id} battery={bat} />
                  ))}
                </div>

                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                      Load More
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Marketplace;
