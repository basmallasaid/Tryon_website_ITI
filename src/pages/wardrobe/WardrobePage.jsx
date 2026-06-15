import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { showToast } from '../../utils/toast';
import WardrobeHealth from '../../components/wardrobe/WardrobeHealth';
import WardrobeFilters from '../../components/wardrobe/WardrobeFilters';
import WardrobeItemCard from '../../components/wardrobe/WardrobeItemCard';
import EmptyState from '../../components/wardrobe/EmptyState';
import AddItemModal from '../../components/wardrobe/AddItemModal';
import ItemDetailsModal from '../../components/wardrobe/ItemDetailsModal';
import { Plus, Loader2, AlertCircle } from 'lucide-react';
import { getWardrobeApi, deleteWardrobeItemApi } from '../../api/userApi';

const WardrobePage = () => {
  const { t } = useTranslation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);


  const dynamicCategories = useMemo(() => {
    if (items.length === 0) return ['All'];

  
    const existingCats = items
      .map((item) => item.category)
      .filter((cat) => cat) 
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase());

    
    return ['All', ...new Set(existingCats)];
  }, [items]);

  const fetchWardrobe = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWardrobeApi();
      setItems(res.data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || t('wardrobe.failedToLoad'));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWardrobe();
  }, [fetchWardrobe]);

  const handleDelete = async (itemId) => {
    const result = await Swal.fire({
      title: t('wardrobe.deleteTitle'),
      text: t('wardrobe.deleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('wardrobe.yesDelete'),
      cancelButtonText: t('wardrobe.cancel'),
    });
    if (!result.isConfirmed) return;
    try {
      await deleteWardrobeItemApi(itemId);
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      setSelectedItem(null);
      showToast('success', t('wardrobe.deletedSuccess'));
    } catch (err) {
      showToast('error', t('wardrobe.deleteFailed'));
    }
  };

 
  const filteredItems = useMemo(() => {
    return activeFilter === 'All'
      ? items
      : items.filter((item) =>
        item.category?.toLowerCase() === activeFilter.toLowerCase()
      );
  }, [items, activeFilter]);

  return (
    <div className="min-h-screen bg-[var(--surface)] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <WardrobeHealth itemCount={items.length} />

        
        <WardrobeFilters
          categories={dynamicCategories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[var(--secondary)] animate-spin mb-4" />
            <p className="text-text-secondary font-bold">
              {t('wardrobe.loading')}
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24">
            <AlertCircle size={48} className="text-error-text mb-4" />
            <p className="text-error-text font-bold text-lg mb-2">
              {t('wardrobe.failedToLoad')}
            </p>
            <p className="text-text-disabled text-sm text-center max-w-md">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <EmptyState onAdd={() => setIsAddModalOpen(true)} />
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center px-2">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                {t('wardrobe.showingItems', { count: filteredItems.length })}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
             
               <button
                onClick={() => setIsAddModalOpen(true)}
                className="aspect-[4/5] border-4 border-dashed border-[var(--border)] rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-text-secondary hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-surface-elevated/50"
              >
                <div className="p-4 bg-[var(--bg-secondary)] rounded-full"><Plus size={32} /></div>
                <span className="font-bold text-[10px] tracking-widest uppercase">
                  {t('wardrobe.addItem')}
                </span>
              </button>
              {filteredItems.map((item) => (
                <WardrobeItemCard key={item._id} item={item} onClick={setSelectedItem} />
              ))}

              
             
            </div>
          </div>
        )}
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={(newItem) => setItems((prev) => [...prev, newItem])}
      />

      <ItemDetailsModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default WardrobePage;