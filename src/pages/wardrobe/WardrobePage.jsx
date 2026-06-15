import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { showToast } from '../../utils/toast';
import WardrobeHealth from '../../components/wardrobe/WardrobeHealth';
import WardrobeFilters from '../../components/wardrobe/WardrobeFilters';
import WardrobeItemCard from '../../components/wardrobe/WardrobeItemCard';
import EmptyState from '../../components/wardrobe/EmptyState';
import AddItemModal from '../../components/wardrobe/AddItemModal';
import ItemDetailsModal from '../../components/wardrobe/ItemDetailsModal';
import { Plus, Loader2 } from 'lucide-react';
import { deleteWardrobeItemApi } from '../../api/userApi';
import { useWardrobe } from '../../context/WardrobeContext';

const PAGE_SIZE = 20;

const WardrobePage = () => {
  const { t } = useTranslation();
  const { items: contextItems, loading: ctxLoading, refetch } = useWardrobe();

  const [displayItems, setDisplayItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setDisplayItems(contextItems);
  }, [contextItems]);

  const dynamicCategories = useMemo(() => {
    if (displayItems.length === 0) return ['All'];
    const existingCats = displayItems
      .map((item) => item.category)
      .filter((cat) => cat)
      .map((cat) => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase());
    return ['All', ...new Set(existingCats)];
  }, [displayItems]);

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
      setDisplayItems((prev) => prev.filter((item) => item._id !== itemId));
      setSelectedItem(null);
      showToast('success', t('wardrobe.deletedSuccess'));
      refetch();
    } catch (err) {
      showToast('error', t('wardrobe.deleteFailed'));
    }
  };

  const filteredItems = useMemo(() => {
    return activeFilter === 'All'
      ? displayItems
      : displayItems.filter((item) =>
          item.category?.toLowerCase() === activeFilter.toLowerCase()
        );
  }, [displayItems, activeFilter]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = visibleCount < filteredItems.length;

  return (
    <div className="min-h-screen bg-[var(--surface)] p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        <WardrobeHealth itemCount={displayItems.length} />

        <WardrobeFilters
          categories={dynamicCategories}
          activeFilter={activeFilter}
          onFilterChange={(val) => { setActiveFilter(val); setVisibleCount(PAGE_SIZE); }}
        />

        {ctxLoading && displayItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-[var(--secondary)] animate-spin mb-4" />
            <p className="text-text-secondary font-bold">
              {t('wardrobe.loading')}
            </p>
          </div>
        ) : displayItems.length === 0 ? (
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
              {visibleItems.map((item) => (
                <WardrobeItemCard key={item._id} item={item} onClick={setSelectedItem} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="px-8 py-3 bg-[var(--primary)] text-white font-bold rounded-full hover:opacity-90 transition-all shadow-md cursor-pointer"
                >
                  {t('wardrobe.showMore', 'Show More')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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