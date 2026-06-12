import { useState, useEffect } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import StoreRow from '../components/StoreRow';
import StoreCard from '../components/StoreCard';
import { getStoresApi, getProductsApi } from '../../../api/adminApi';

const PAGE_SIZE = 5;

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function StoresSection({ onAddStore }) {
  const [stores, setStores] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tabFilter, setTabFilter] = useState('All Stores');
  const [page, setPage] = useState(1);

  const tabs = ['All Stores', 'Performance', 'Growth'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storesRes, productsRes] = await Promise.all([
          getStoresApi(),
          getProductsApi(),
        ]);
        const storesData = Array.isArray(storesRes.data) ? storesRes.data : [];
        const productsData = Array.isArray(productsRes.data) ? productsRes.data : [];

        const counts = {};
        productsData.forEach((p) => {
          const sid = p.store_id?._id || p.store_id;
          if (sid) counts[sid] = (counts[sid] || 0) + 1;
        });

        setStores(storesData);
        setProductCounts(counts);
      } catch (err) {
        console.error('Failed to fetch stores:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapped = stores.map((s) => ({
    id: s._id,
    name: s.name,
    logo: s.logo_url,
    website: s.website_url,
    websiteLabel: extractDomain(s.website_url || ''),
    discountPercent: s.discount_percent || 0,
    couponCode: s.discount_code || '—',
    discountDescription: s.description || '',
    products: productCounts[s._id] || 0,
    status: s.is_active ? 'Active' : 'Inactive',
    joined: formatDate(s.created_at),
  }));

  const filtered = mapped.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(filter.toLowerCase()) || s.id.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    const matchesTab = tabFilter === 'All Stores' || (tabFilter === 'Performance' && s.products >= 10) || (tabFilter === 'Growth' && s.status === 'Active');
    return matchesSearch && matchesStatus && matchesTab;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => { setFilter(''); setStatusFilter('All'); setPage(1); };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="mb-8">
          <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Global Store Network</h1>
          <p className="text-sm text-admin-text-secondary mt-1">Manage and monitor all retail partners across the globe.</p>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-admin-input border border-admin-border rounded-xl w-[220px]">
            <Filter className="w-[14px] h-[14px] text-admin-text-secondary" />
            <input
              type="text"
              placeholder="Filter stores..."
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-input border border-admin-border rounded-xl text-xs text-admin-text-secondary outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(filter || statusFilter !== 'All') && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-admin-text-secondary hover:text-admin-text-primary transition-colors ml-2">
              <X className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-admin-border/40 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-admin-border/60">
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Store & Logo</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Website</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Discount Details</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Products</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-[11px] font-semibold text-admin-text-secondary uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-admin-text-muted">Loading stores…</td></tr>
              ) : paginated.length > 0 ? (
                paginated.map((store) => <StoreRow key={store.id} store={store} />)
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-admin-text-muted">No stores match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-xs text-admin-text-secondary">
          <span>{loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} - ${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} stores`}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40 hover:bg-admin-brand-activeBg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${
                  p === page ? 'bg-admin-brand text-white' : 'border border-admin-border hover:bg-admin-brand-activeBg'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40 hover:bg-admin-brand-activeBg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">Global Store Network</h1>
          <p className="text-base text-admin-text-secondary mt-2 leading-6">Manage and monitor all retail partners.</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setTabFilter(tab); setPage(1); }}
              className={`shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                tabFilter === tab
                  ? 'bg-admin-brand text-white'
                  : 'bg-admin-input text-admin-text-secondary border border-admin-border'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-admin-input border border-admin-border rounded-xl">
            <Filter className="w-3.5 h-3.5 text-admin-text-secondary" />
            <input
              type="text"
              placeholder="Filter stores..."
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-xs text-admin-text-primary outline-none placeholder:text-admin-text-muted w-full"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 bg-admin-input border border-admin-border rounded-xl text-xs text-admin-text-secondary outline-none"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-admin-text-muted py-8">Loading stores…</p>
          ) : paginated.length > 0 ? (
            paginated.map((store) => <StoreCard key={store.id} store={store} />)
          ) : (
            <p className="text-center text-sm text-admin-text-muted py-8">No stores match your filters.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center text-xs text-admin-text-secondary pt-2 gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <button onClick={onAddStore} className="lg:hidden fixed bottom-20 right-5 z-40 w-14 h-14 rounded-full bg-admin-brand text-white shadow-lg flex items-center justify-center hover:bg-admin-brand-light transition-colors">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </>
  );
}
