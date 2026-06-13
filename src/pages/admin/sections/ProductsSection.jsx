import { useState, useEffect } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Plus, SlidersHorizontal, Trash2, Pencil, ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';
import ProductRow from '../components/ProductRow';
import ProductCard from '../components/ProductCard';
import { getProductsApi, getStoresApi, deleteProductApi } from '../../../api/adminApi';

const PAGE_SIZE = 5;

const categoryLabels = { top: 'Tops', bottom: 'Bottoms', dress: 'Dresses', acc: 'Accessories' };

export default function ProductsSection({ onAddProduct, onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeFilter, setStoreFilter] = useState('All Stores');
  const [categoryFilter, setCategoryFilter] = useState('category');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sortBy, setSortBy] = useState('none');
  const [sortDir, setSortDir] = useState('asc');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const [productsRes, storesRes] = await Promise.all([
        getProductsApi(),
        getStoresApi(),
      ]);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setStores(Array.isArray(storesRes.data) ? storesRes.data : []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const storeMap = {};
  stores.forEach((s) => { storeMap[s._id] = s.name; });

  const dynamicCategories = ['category', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const mapped = products.map((p) => ({
    id: p._id,
    name: p.name,
    sku: p._id.slice(-8).toUpperCase(),
    image: p.images?.[0] || null,
    store: storeMap[p.store_id?._id || p.store_id] || 'Unknown Store',
    storeId: p.store_id?._id || p.store_id,
    category: p.category,
    categoryLabel: categoryLabels[p.category] || p.category,
    season: p.season_tags?.[0] || '—',
    price: p.price || 0,
    currency: p.currency || 'USD',
    tryOn: p.try_on_enabled,
    status: p.is_active ? 'Active' : 'Draft',
  }));

  let filtered = mapped.filter((p) => {
    const matchStore = storeFilter === 'All Stores' || p.storeId === storeFilter;
    const matchCat = categoryFilter === 'category' || p.category === categoryFilter;
    const matchMin = priceMin === '' || p.price >= Number(priceMin);
    const matchMax = priceMax === '' || p.price <= Number(priceMax);
    return matchStore && matchCat && matchMin && matchMax;
  });

  if (sortBy === 'price') {
    filtered.sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price);
  } else if (sortBy === 'name') {
    filtered.sort((a, b) => sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasFilters = storeFilter !== 'All Stores' || categoryFilter !== 'category' || priceMin !== '' || priceMax !== '' || sortBy !== 'none';

  const resetFilters = () => {
    setStoreFilter('All Stores');
    setCategoryFilter('category');
    setPriceMin('');
    setPriceMax('');
    setSortBy('none');
    setSortDir('asc');
    setPage(1);
  };

  const allVisibleSelected = paginated.length > 0 && paginated.every((p) => selectedIds.has(p.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.delete(p.id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        paginated.forEach((p) => next.add(p.id));
        return next;
      });
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} product(s)?`)) return;
    try {
      await Promise.all([...selectedIds].map((id) => deleteProductApi(id)));
      setSelectedIds(new Set());
      fetchProducts();
    } catch (err) {
      alert('Failed to delete some products.');
    }
  };

  const handleEdit = () => {
    if (selectedIds.size !== 1) return;
    const id = [...selectedIds][0];
    const product = products.find((p) => p._id === id);
    if (product && onEditProduct) onEditProduct(product);
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-semibold text-admin-text-primary tracking-[-0.64px]">Products</h1>
            <p className="text-sm text-admin-text-secondary mt-1">Manage your global product catalog.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <select
            value={storeFilter}
            onChange={(e) => { setStoreFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none min-w-[180px]"
          >
            <option value="All Stores">All Stores</option>
            {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-admin-brand-bg border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none min-w-[160px]"
          >
            {dynamicCategories.map((c) => (
              <option key={c} value={c}>{c === 'category' ? 'category' : (categoryLabels[c] || c)}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${showFilterPanel || hasFilters ? 'bg-admin-brand text-white' : 'bg-admin-category text-admin-text-secondary hover:bg-admin-border'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
          {hasFilters && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs font-medium text-admin-brand hover:underline ml-1">
              <X className="w-3 h-3" /> Reset Filters
            </button>
          )}
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              {selectedIds.size === 1 && (
                <button onClick={handleEdit} className="flex items-center gap-1.5 px-4 py-2 bg-admin-brand/10 text-admin-brand rounded-lg text-xs font-medium hover:bg-admin-brand/20 transition-colors">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-4 py-2 bg-admin-danger/10 text-admin-danger rounded-lg text-xs font-medium hover:bg-admin-danger/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.size})
              </button>
            </div>
          )}
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="bg-white border border-admin-border/40 rounded-xl p-4 mb-6 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-admin-text-secondary">Price Range:</label>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-24 px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
                />
                <span className="text-admin-text-muted">—</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-24 px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
                />
              </div>
              <div className="w-px h-8 bg-admin-border" />
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-admin-text-secondary">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
                >
                  <option value="none">None</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                </select>
                {sortBy !== 'none' && (
                  <button
                    onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                    className="p-2 bg-admin-brand-bg border border-admin-border rounded-lg hover:bg-admin-border/30 transition-colors"
                  >
                    {sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-admin-border/40 shadow-sm overflow-hidden mb-6">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-admin-category/50">
                <th className="py-3 px-4 w-12">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-admin-border accent-admin-brand"
                  />
                </th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Product</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Store & Category</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Season</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Price</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider text-center">Try-On</th>
                <th className="py-3 px-4 text-[11px] font-bold text-admin-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-admin-text-muted">Loading products…</td></tr>
              ) : paginated.length > 0 ? (
                paginated.map((p) => (
                  <ProductRow key={p.id} product={p} selected={selectedIds.has(p.id)} onToggle={toggleSelect} />
                ))
              ) : (
                <tr><td colSpan={7} className="py-12 text-center text-sm text-admin-text-muted">No products match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between text-sm text-admin-text-secondary">
          <span>{loading ? 'Loading…' : `Showing ${filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length} products`}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded flex items-center justify-center hover:bg-admin-brand-activeBg disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded flex items-center justify-center text-sm font-medium transition-colors ${p === page ? 'bg-admin-brand text-white' : 'hover:bg-admin-brand-activeBg'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded flex items-center justify-center hover:bg-admin-brand-activeBg disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden px-4 py-6 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-[-0.64px]">Products</h1>
          <span className="text-sm text-admin-text-secondary">{loading ? '—' : `${filtered.length} total`}</span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onAddProduct} className="flex items-center gap-2 px-4 py-2.5 bg-admin-brand text-white rounded-xl text-xs font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Product
          </button>
          {selectedIds.size > 0 && (
            <>
              {selectedIds.size === 1 && (
                <button onClick={handleEdit} className="flex items-center gap-1.5 px-4 py-2.5 bg-admin-brand/10 text-admin-brand rounded-xl text-xs font-medium">
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              )}
              <button onClick={handleDelete} className="flex items-center gap-1.5 px-4 py-2.5 bg-admin-danger/10 text-admin-danger rounded-xl text-xs font-medium">
                <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedIds.size})
              </button>
            </>
          )}
        </div>

        {/* Mobile Filter Panel */}
        <div className="flex items-center gap-2">
          <select
            value={storeFilter}
            onChange={(e) => { setStoreFilter(e.target.value); setPage(1); }}
            className="flex-1 px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-xl text-xs text-admin-text-primary outline-none"
          >
            <option value="All Stores">All Stores</option>
            {stores.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className="flex-1 px-3 py-2.5 bg-admin-brand-bg border border-admin-border rounded-xl text-xs text-admin-text-primary outline-none"
          >
            {dynamicCategories.map((c) => (
              <option key={c} value={c}>{c === 'category' ? 'All Categories' : (categoryLabels[c] || c)}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-colors ${showFilterPanel || hasFilters ? 'bg-admin-brand border-admin-brand text-white' : 'bg-white border-admin-border text-admin-text-secondary'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {hasFilters && (
          <button onClick={resetFilters} className="flex items-center justify-center gap-1 text-xs font-medium text-admin-brand">
            <X className="w-3 h-3" /> Reset Filters
          </button>
        )}

        {showFilterPanel && (
          <div className="bg-white border border-admin-border/40 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-admin-text-secondary whitespace-nowrap">Price:</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                placeholder="Min"
                className="flex-1 px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
              />
              <span className="text-admin-text-muted">—</span>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                placeholder="Max"
                className="flex-1 px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs font-medium text-admin-text-secondary whitespace-nowrap">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="flex-1 px-3 py-2 bg-admin-brand-bg border border-admin-border rounded-lg text-xs text-admin-text-primary outline-none"
              >
                <option value="none">None</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
              </select>
              {sortBy !== 'none' && (
                <button
                  onClick={() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-admin-brand-bg border border-admin-border rounded-lg"
                >
                  {sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded border-admin-border accent-admin-brand"
            />
            <span className="text-xs text-admin-text-secondary">Select all</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-center text-sm text-admin-text-muted py-8">Loading products…</p>
          ) : paginated.length > 0 ? (
            paginated.map((p) => (
              <div key={p.id} className="relative">
                <input
                  type="checkbox"
                  checked={selectedIds.has(p.id)}
                  onChange={() => toggleSelect(p.id)}
                  className="absolute top-4 left-4 z-10 w-4 h-4 rounded border-admin-border accent-admin-brand"
                />
                <ProductCard product={p} />
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-admin-text-muted py-8">No products match your filters.</p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center text-xs text-admin-text-secondary pt-2 gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">Page {page} of {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center border border-admin-border disabled:opacity-40">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
