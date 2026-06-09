import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import FilterSidebar from '../../components/store/FilterSidebar';
import ProductCard from '../../components/store/ProductCard';
import { getAllProducts, getAllStores } from '../../api/userApi';
import { SlidersHorizontal, Search, ChevronDown, LayoutGrid, List as ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { translateProducts } from '../../utils/translate';

const normalizeId = (id) => {
  if (!id) return null;
  if (typeof id === 'object') {
    return String(id.$oid || id._id || '');
  }
  return String(id);
};

const StoresPage = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [products, setProducts] = useState([]);
  const [translatedProducts, setTranslatedProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const translationCache = useRef({});

  const [options, setOptions] = useState({
    categories: [],
    brands: [],
    colors: [],
    seasons: [],
  });

  const [maxPriceLimit, setMaxPriceLimit] = useState(0);

  const [filters, setFilters] = useState({
    selectedBrands: [],
    selectedCategories: [],
    selectedSeasons: [],
    maxPrice: 0,
    selectedColors: [],
    tryOnOnly: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, storeRes] = await Promise.all([
          getAllProducts(),
          getAllStores(),
        ]);
        const prodData = prodRes?.data ?? [];
        const storeData = storeRes?.data ?? [];
        setProducts(prodData);
        setStores(storeData);

        const categories = [...new Set(
          prodData.map((p) => p.category?.trim().toUpperCase()).filter(Boolean)
        )];

        const brands = storeData.map((s) => ({ 
          id: normalizeId(s._id || s.id), 
          name: s.name?.trim().toUpperCase() 
        }));

        const colors = [...new Set(
          prodData.flatMap((p) => p.color_tags || [])
                 .map(c => c?.trim().toUpperCase())
                 .filter(Boolean)
        )];

        const seasons = [...new Set(
          prodData.flatMap((p) => p.season_tags || [])
                 .map(s => s?.trim().toUpperCase())
                 .filter(Boolean)
        )];

        const prices = prodData.map((p) => Number(p.price)).filter((n) => !isNaN(n));
        const maxP = prices.length ? Math.max(...prices) : 2000;

        setOptions({ categories, brands, colors, seasons });
        setMaxPriceLimit(maxP);
        setFilters((prev) => ({ ...prev, maxPrice: maxP }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTranslate = useCallback(async () => {
    if (products.length === 0) return;

    const cacheKey = products.map(p => p._id).join(',');
    if (translationCache.current[cacheKey]) {
      setTranslatedProducts(translationCache.current[cacheKey]);
      return;
    }

    try {
      setTranslating(true);
      const translated = await translateProducts(products);
      translationCache.current[cacheKey] = translated;
      setTranslatedProducts(translated);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setTranslating(false);
    }
  }, [products]);

  useEffect(() => {
    if (isArabic && products.length > 0 && translatedProducts.length === 0) {
      handleTranslate();
    }
  }, [isArabic, products, translatedProducts.length, handleTranslate]);

  const displayProducts = isArabic && translatedProducts.length > 0
    ? translatedProducts
    : products;

  const filteredProducts = useMemo(() => {
    return displayProducts.filter((product) => {
      const productStoreId = normalizeId(product.store_id);
      const nameMatch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const brandMatch = filters.selectedBrands.length === 0 || filters.selectedBrands.includes(productStoreId);
      const categoryMatch = filters.selectedCategories.length === 0 || 
                           filters.selectedCategories.includes(product.category?.toUpperCase());
      const seasonMatch = filters.selectedSeasons.length === 0 || 
                         (product.season_tags || []).some((s) => filters.selectedSeasons.includes(s.toUpperCase()));
      const colorMatch = filters.selectedColors.length === 0 || 
                        (product.color_tags || []).some((c) => filters.selectedColors.includes(c.toUpperCase()));
      const priceMatch = Number(product.price) <= filters.maxPrice;
      const tryOnMatch = !filters.tryOnOnly || product.try_on_enabled === true;

      return nameMatch && brandMatch && categoryMatch && seasonMatch && priceMatch && colorMatch && tryOnMatch;
    });
  }, [displayProducts, filters, searchQuery]);

  const showProducts = loading || translating;

  return (
    <div className="min-h-screen bg-[#F4F3F5] px-4 sm:px-6 lg:px-10 py-6 font-roboto mt-5">
      <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row gap-8 xl:gap-12">
        <FilterSidebar
          options={options}
          filters={filters}
          setFilters={setFilters}
          maxPriceLimit={maxPriceLimit}
          products={products}
        />

        <div className="flex-1 p-2 md:p-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-[#101828] tracking-tight mb-3">Stores</h1>
            <p className="text-gray-500 text-[15px] font-bold mb-6">
              you can get Discount on all your Favorite Brands Now, when you{" "}
              <span className="bg-gradient-to-r from-[#8ED321] to-[#40B9FF] bg-clip-text text-transparent font-bold cursor-pointer hover:underline">install the application!</span>
            </p>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border-transparent rounded-[1.2rem] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40B9FF]/20 transition-all text-gray-600 font-medium"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-gray-50 gap-4">
              <p className="text-sm font-medium text-gray-500">
                Showing <span className="text-gray-900 font-bold">1-{filteredProducts.length}</span> of {displayProducts.length} products
                {translating && <span className="ml-2 text-[#40B9FF]">Translating...</span>}
              </p>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <span className="text-xs text-gray-400 font-medium tracking-tight">Sort by:</span>
                  <span className="text-sm font-bold text-gray-900 group-hover:text-[#40B9FF] transition-colors">Newest</span>
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
                
                <div className="flex items-center gap-1 bg-[#F4F3F5] p-1.5 rounded-2xl">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'grid' ? 'bg-white text-[#40B9FF] shadow-sm border border-gray-50' : 'text-gray-300'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-xl transition-all duration-300 ${viewMode === 'list' ? 'bg-white text-[#40B9FF] shadow-sm border border-gray-50' : 'text-gray-300'}`}
                  >
                    <ListIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {showProducts ? (
            <div className={`grid gap-6 lg:gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3' : 'grid-cols-1'}`}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`flex gap-4 ${viewMode === 'grid' ? 'flex-col' : 'flex-row'}`}>
                  <div className={`${viewMode === 'grid' ? 'aspect-[3/4]' : 'w-1/3 h-48'} bg-gray-100 rounded-[1.5rem] animate-pulse`} />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-1/4 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`grid gap-8 transition-all duration-500 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 2xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product, idx) => (
                <ProductCard
                  key={normalizeId(product._id) || idx}
                  product={product}
                  viewMode={viewMode}
                  store={stores.find((s) => normalizeId(s._id || s.id) === normalizeId(product.store_id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
