import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import {
    Shirt, CloudSun, Trash2, ArrowLeft, Check,
    Layers, User, Loader2, Palette, Sparkles
} from 'lucide-react';
import Swal from 'sweetalert2';

import { getCategoriesByGender } from '../../constants/wardrobeCategories';
import { getWardrobeApi, deleteWardrobeItemApi, getAnalysisApi, addWardrobeItemFromAnalysisApi, updateAnalysisApi } from '../../api/userApi';

const EditItemWardrobe = () => {
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
        name: '',
        category: '',
        season: '',
        style: '',
        color: '',
        pattern: '',
        gender: '',
    });
    const [imageUrl, setImageUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const isNew = id === 'new';

    const isMatching = (val1, val2) => {
        return val1?.toLowerCase() === val2?.toLowerCase();
    };

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await getWardrobeApi();
                const item = res.data.items?.find((i) => i._id === id);
                if (item) {
                    setFormData({
                        name: item.name || '',
                        category: item.category || '',
                        season: Array.isArray(item.season) ? item.season[0] : item.season || '',
                        style: item.style || '',
                        color: item.color || '',
                        pattern: item.pattern || '',
                        gender: item.gender || 'unisex',
                    });
                    setImageUrl(item.image || '');
                }
            } catch (err) {
                console.error("Error loading item:", err);
            } finally {
                setLoading(false);
            }
        };

        const fetchAnalysis = async () => {
            try {
                const res = await getAnalysisApi(analysisId);
                const data = res.data;
                const garment = data.garments?.[0] || data;
                originalGarmentRef.current = garment;
                setFormData({
                    name: garment.specificType || garment.name || '',
                    category: garment.category || '',
                    season: Array.isArray(garment.season) ? garment.season[0] : garment.season || '',
                    style: garment.style || '',
                    color: garment.colors?.[0]?.color || garment.color || '',
                    pattern: garment.pattern || '',
                    gender: garment.gender || 'unisex',
                });
                setImageUrl(data.image || garment.image || '');
            } catch (err) {
                console.error("Error loading analysis:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isNew && navState?.analysisResult) {
            const garment = navState.analysisResult.garments?.[0] || navState.analysisResult;
            originalGarmentRef.current = garment;
            setFormData({
                name: garment.specificType || garment.name || '',
                category: garment.category || '',
                season: Array.isArray(garment.season) ? garment.season[0] : garment.season || '',
                style: garment.style || '',
                color: garment.colors?.[0]?.color || garment.color || '',
                pattern: garment.pattern || '',
                gender: garment.gender || 'unisex',
            });
            if (imageFile) {
                setImageUrl(URL.createObjectURL(imageFile));
            }
            setLoading(false);
        } else if (isNew && analysisId) {
            fetchAnalysis();
        } else if (id && !isNew) {
            fetchItem();
        } else {
            setLoading(false);
        }
    }, [id, analysisId, isNew, navState, imageFile]);

    useEffect(() => {
        return () => {
            if (imageUrl && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const handleUpdateField = (field, value) => {
        if (!isNew) return;
        setFormData(prev => ({ ...prev, [field]: value }));
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
                        season: [formData.season],
                        colors: original?.colors || [{ color: formData.color, percentage: 100 }],
                        pattern: formData.pattern,
                        gender: formData.gender,
                        confidence: original?.confidence || 0,
                    }]
                });
                await addWardrobeItemFromAnalysisApi(analysisId, { garment_index: 0 });
                Swal.fire({ icon: 'success', title: 'Item added to wardrobe successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
                navigate('/wardeobe');
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to add item', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Delete Item?',
            text: 'Are you sure you want to remove this item from your wardrobe?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
        });
        if (!result.isConfirmed) return;
        try {
            await deleteWardrobeItemApi(id);
            Swal.fire({ icon: 'success', title: 'Item deleted successfully', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
            navigate('/wardeobe');
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Failed to delete item', toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        </div>
    );

    const SelectionChip = ({ label, activeValue, onClick, activeClass }) => (
        <button
            type="button"
            onClick={() => onClick(label)}
            className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all duration-200 border ${isMatching(activeValue, label)
                ? `${activeClass} scale-105`
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}
        >
            {label.toUpperCase()}
        </button>
    );

    const currentCategories = getCategoriesByGender(formData.gender);

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button onClick={() => navigate('/wardeobe')} className="group flex items-center gap-2 text-gray-500 font-semibold hover:text-gray-900">
                        <div className="p-2 bg-white rounded-lg shadow-sm"><ArrowLeft size={18} /></div>
                        Back to Wardrobe
                    </button>
                    {!isNew && (
                        <button onClick={handleDelete} className="p-2.5 bg-red-50 text-[var(--color-accent-orange)] rounded-xl hover:bg-red-100">
                            <Trash2 size={20} />
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center">
                            <div className="w-64 h-80 rounded-[2rem] overflow-hidden bg-gray-50 border-4 border-gray-50 shadow-md">
                                <img src={imageUrl} alt="Item" className="w-full h-full object-cover" />
                            </div>

                            <div className="mt-8 w-full">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Item Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleUpdateField('name', e.target.value)}
                                    readOnly={!isNew}
                                    className="w-full mt-1 bg-gray-50 border-none rounded-2xl p-4 text-gray-900 font-bold text-lg focus:ring-2 focus:ring-blue-500/20"
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                                <Palette
                                    size={14}
                                    style={{ color: formData.color ? formData.color.toLowerCase() : 'gray' }}
                                />
                                <span
                                    className="text-xs font-bold uppercase tracking-tight"
                                    style={{ color: formData.color ? formData.color.toLowerCase() : '#666' }}
                                >
                                    Color: {formData.color || 'Not Specified'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-gray-100 space-y-10">
                            <section>
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                    <User size={18} className="text-[var(--color-brand-secondary)]" /> Intended Gender
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['male', 'female', 'unisex'].map(g => (
                                        <SelectionChip
                                            key={g} label={g} activeValue={formData.gender}
                                            onClick={(val) => handleUpdateField('gender', val)}
                                            activeClass="border-1 border-[var(--color-light-green)] shadow-sm "
                                        />
                                    ))}
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-10">
                                <section>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                        <Shirt size={18} className="text-[var(--color-brand-secondary)]" /> Category
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentCategories.filter(c => c !== 'All').map(c => (
                                            <SelectionChip
                                                key={c} label={c} activeValue={formData.category}
                                                onClick={(val) => handleUpdateField('category', val)}
                                                activeClass="border-1 border-[var(--color-light-green)] shadow-sm "
                                            />
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                        <CloudSun size={18} className="text-[var(--color-brand-secondary)]" /> Season
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['summer', 'winter', 'spring', 'fall', 'all season'].map(s => (
                                            <SelectionChip
                                                key={s} label={s} activeValue={formData.season}
                                                onClick={(val) => handleUpdateField('season', val)}
                                                activeClass="border-1 border-[var(--color-light-green)] shadow-sm "
                                            />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="grid md:grid-cols-2 gap-10">
                                <section>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                        <Sparkles size={18} className="text-[var(--color-brand-secondary)]" /> Style
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['casual', 'formal', 'streetwear', 'vintage', 'minimalist'].map(st => (
                                            <SelectionChip
                                                key={st} label={st} activeValue={formData.style}
                                                onClick={(val) => handleUpdateField('style', val)}
                                                activeClass="border-1 border-[var(--color-light-green)] shadow-sm "
                                            />
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
                                        <Layers size={18} className="text-[var(--color-brand-secondary)]" /> Pattern
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['solid', 'striped', 'floral', 'checkered', 'graphic'].map(p => (
                                            <SelectionChip
                                                key={p} label={p} activeValue={formData.pattern}
                                                onClick={(val) => handleUpdateField('pattern', val)}
                                                activeClass="border-1 border-[var(--color-light-green)] shadow-sm "
                                            />
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {isNew && (
                            <div className="pt-6 border-t border-gray-50">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-[var(--color-primary)] text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {saving ? <Loader2 className="animate-spin" /> : <><Check size={22} /> Add to Wardrobe</>}
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
