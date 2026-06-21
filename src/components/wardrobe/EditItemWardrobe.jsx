import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
    Shirt, CloudSun, Trash2, ArrowLeft, Check,
    Layers, User, Loader2, Palette, Sparkles, Heart
} from 'lucide-react';
import Swal from 'sweetalert2';
import { showToast } from '../../utils/toast';

import { useFavorites } from '../../context/FavoritesContext';
import { useWardrobe } from '../../context/WardrobeContext';
import { getCategoriesByGender } from '../../constants/wardrobeCategories';
import { getWardrobeApi, deleteWardrobeItemApi, getAnalysisApi, addWardrobeItemFromAnalysisApi, updateAnalysisApi } from '../../api/userApi';

const EditItemWardrobe = () => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === "ar";
    const { id } = useParams();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const navState = location.state;
    const analysisId = navState?.analysisId || searchParams.get('analysisId');
    const analysisResult = navState?.analysisResult;
    const imageFile = navState?.imageFile;

    const originalGarmentRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', category: '', season: [], style: '', color: '', pattern: '', gender: '',
    });
    const [imageUrl, setImageUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const isNew = id === 'new';
    
    // ربط المفضلة بالـ Context
    const { isFavorite, addItem, removeItem } = useFavorites();
    const { refetch } = useWardrobe();
    const favorited = !isNew && isFavorite(id);

    const isMatching = (val1, val2) => val1?.toLowerCase() === val2?.toLowerCase();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await getWardrobeApi();
                const item = res.data.items?.find((i) => i._id === id);
                if (item) {
                    setFormData({
                        name: item.name || '',
                        category: item.category || '',
                        season: Array.isArray(item.season) ? item.season : item.season ? [item.season] : [],
                        style: item.style || '',
                        color: item.color || '',
                        pattern: item.pattern || '',
                        gender: item.gender || 'unisex',
                    });
                    setImageUrl(item.image || '');
                }
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };

        const fetchAnalysis = async () => {
            try {
                const res = await getAnalysisApi(analysisId);
                const garment = res.data.garments?.[0] || res.data;
                originalGarmentRef.current = garment;
                setFormData({
                    name: garment.specificType || garment.name || '',
                    category: garment.category || '',
                    season: Array.isArray(garment.season) ? garment.season : garment.season ? [garment.season] : [],
                    style: garment.style || '',
                    color: garment.colors?.[0]?.color || garment.color || '',
                    pattern: garment.pattern || '',
                    gender: garment.gender || 'unisex',
                });
                setImageUrl(res.data.image || garment.image || '');
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };

        if (isNew && navState?.analysisResult) {
            const garment = navState.analysisResult.garments?.[0] || navState.analysisResult;
            originalGarmentRef.current = garment;
            setFormData({
                name: garment.specificType || garment.name || '',
                category: garment.category || '',
                season: Array.isArray(garment.season) ? garment.season : garment.season ? [garment.season] : [],
                style: garment.style || '',
                color: garment.colors?.[0]?.color || garment.color || '',
                pattern: garment.pattern || '',
                gender: garment.gender || 'unisex',
            });
            if (imageFile) setImageUrl(URL.createObjectURL(imageFile));
            setLoading(false);
        } else if (isNew && analysisId) {
            fetchAnalysis();
        } else if (id && !isNew) {
            fetchItem();
        } else { setLoading(false); }
    }, [id, analysisId, isNew, navState, imageFile]);

    const handleUpdateField = (field, value) => {
        if (!isNew) return;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleToggleSeason = (season) => {
        if (!isNew) return;
        setFormData(prev => {
            const current = prev.season || [];
            const updated = current.includes(season)
                ? current.filter(s => s !== season)
                : [...current, season];
            return { ...prev, season: updated };
        });
    };

    const handleFavorite = (e) => {
        e.stopPropagation();
        if (favorited) {
            removeItem(id);
        } else {
            addItem(id, 'WARDROBE');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (isNew && analysisId) {
                const original = originalGarmentRef.current;
                await updateAnalysisApi(analysisId, {
                    detectionType: analysisResult?.detectionType || 'single',
                    garments: [{
                        specificType: formData.name,
                        category: formData.category,
                        style: formData.style,
                        season: formData.season,
                        colors: original?.colors || [{ color: formData.color, percentage: 100 }],
                        pattern: formData.pattern,
                        gender: formData.gender,
                        confidence: original?.confidence || 0,
                    }]
                });
                await addWardrobeItemFromAnalysisApi(analysisId, { garment_index: 0 });
                showToast('success', t('wardrobe.addedSuccess'));
                await refetch();
                navigate('/wardrobe');
            }
        } catch (err) {
            const isDuplicate = err.response?.status === 409
                || err.response?.data?.message?.toLowerCase().includes('already exist');
            showToast('error', isDuplicate ? t('wardrobe.addDuplicate') : t('wardrobe.addFailed'));
        } finally { setSaving(false); }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: t('wardrobe.deleteTitle'),
            text: t('wardrobe.deleteConfirm'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            confirmButtonText: t('wardrobe.yesDelete'),
            cancelButtonText: t('wardrobe.cancel'),
        });
        if (result.isConfirmed) {
            try {
                await deleteWardrobeItemApi(id);
                showToast('success', t('wardrobe.deletedSuccess'));
                navigate('/wardrobe');
            } catch (err) { showToast('error', t('wardrobe.deleteFailed')); }
        }
    };

    const SelectionChip = ({ label, activeValue, onClick, activeClass }) => (
        <button
            type="button"
            onClick={() => onClick(label)}
             className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${isMatching(activeValue, label)
                ? `border-[var(--color-primary)] text-[var(--color-primary)]`
                : 'bg-surface-elevated border-[var(--border)] text-text-disabled hover:border-[var(--border)] hover:bg-[var(--bg-secondary)]'
            }`}
        >
            {(t('wardrobe.opt_' + label.toLowerCase()) || label).toUpperCase()}
        </button>
    );

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-secondary)]">
            <Loader2 className="w-10 h-10 text-[var(--color-primary)] animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-surface-elevated p-4 md:p-8" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate('/wardrobe')} className="flex items-center gap-2 text-text-secondary font-bold hover:text-[var(--primary)] transition-colors">
                        <ArrowLeft size={20} className={isArabic ? 'rotate-180' : ''} />
                        <span className="text-sm uppercase tracking-wider">{t('wardrobe.backToWardrobe')}</span>
                    </button>
                    {!isNew && (
                        <div className="flex gap-2">
                            {/* زر المفضلة المحدث */}
                            <button 
                                onClick={handleFavorite} 
                                className={`p-2.5 rounded-xl transition-all shadow-sm ${
                                    favorited 
                                    ? 'text-[var(--color-accent-pink)]' 
                                    : 'bg-surface-elevated text-text-disabled hover:text-[var(--color-accent-pink)]'
                                }`}
                            >
                                <Heart size={18} className={favorited ? 'fill-[var(--color-accent-pink)]' : ''} />
                            </button>

                            {/* زر الحذف */}
                            <button onClick={handleDelete} className="p-2.5 text-[var(--color-accent-orange)] rounded-xl hover:opacity-80 transition-colors shadow-sm">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Left: Image Card */}
                    <div className="lg:col-span-4 lg:sticky lg:top-8">
                        <div className="bg-surface-elevated p-4 rounded-[2rem] shadow-sm border border-[var(--border)] flex flex-col items-center">
                            <div className="w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden bg-[var(--bg-secondary)] shadow-inner">
                                <img src={imageUrl} alt="Item" className="w-full h-full object-cover" />
                            </div>
                            <div className="mt-6 w-full px-2">
                                <label className="text-[10px] font-black text-text-disabled uppercase tracking-widest block mb-1">
                                    {t('wardrobe.itemName')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleUpdateField('name', e.target.value)}
                                    readOnly={!isNew}
                                    className="w-full bg-[var(--bg-secondary)]/50 border-none rounded-xl p-3 text-text-primary font-bold text-base outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Options Card */}
                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-surface-elevated rounded-[2rem] p-6 md:p-8 shadow-sm border border-[var(--border)] space-y-8">
                            {/* ... (باقي أقسام الفورم كما هي في الكود السابق) ... */}
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <User size={16} className="text-[var(--color-primary)]" />
                                    <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">{t('wardrobe.intendedGender')}</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {['male', 'female', 'unisex'].map(g => (
                                        <SelectionChip key={g} label={g} activeValue={formData.gender} onClick={(val) => handleUpdateField('gender', val)} />
                                    ))}
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shirt size={16} className="text-[var(--color-primary)]" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">{t('wardrobe.category')}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {getCategoriesByGender(formData.gender).filter(c => c !== 'All').map(c => (
                                            <SelectionChip key={c} label={c} activeValue={formData.category} onClick={(val) => handleUpdateField('category', val)} />
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <CloudSun size={16} className="text-[var(--color-primary)]" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">{t('wardrobe.season')}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['summer', 'winter', 'spring', 'fall'].map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => handleToggleSeason(s)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 border ${
                                                    formData.season.includes(s)
                                                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                                        : 'bg-surface-elevated border-[var(--border)] text-text-disabled hover:border-[var(--border)] hover:bg-[var(--bg-secondary)]'
                                                }`}
                                            >
                                                {(t('wardrobe.opt_' + s.toLowerCase()) || s).toUpperCase()}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Sparkles size={16} className="text-[var(--color-primary)]" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">{t('wardrobe.style')}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['casual', 'formal', 'streetwear', 'vintage', 'minimalist'].map(st => (
                                            <SelectionChip key={st} label={st} activeValue={formData.style} onClick={(val) => handleUpdateField('style', val)} />
                                        ))}
                                    </div>
                                </section>
                                <section>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Layers size={16} className="text-[var(--color-primary)]" />
                                        <h3 className="text-xs font-black uppercase tracking-widest text-text-primary">{t('wardrobe.pattern')}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {['solid', 'striped', 'floral', 'checkered', 'graphic'].map(p => (
                                            <SelectionChip key={p} label={p} activeValue={formData.pattern} onClick={(val) => handleUpdateField('pattern', val)} />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {isNew && (
                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:opacity-90 shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> {t('wardrobe.addToWardrobe')}</>}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditItemWardrobe;