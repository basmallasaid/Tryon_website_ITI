import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Shirt,
  Sparkles,
  Grid3x3,
  X,
  LogIn,
  Plus,
  Check,
  Lock,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import StepIndicator from '../recycle/components/StepIndicator';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import UploadArea from '../recycle/components/UploadArea';
import UploadedImageCard from '../recycle/components/UploadedImageCard';
import ModelSelectionCard from '../../components/tryOn/ModelSelectionCard';
import WardrobeItem from '../../components/tryOn/WardrobeItem';
import { useAuth } from '../../context/AuthContext';
import { useWardrobe } from '../../context/WardrobeContext';
import Swal from 'sweetalert2';
import { showToast } from '../../utils/toast';
import { getAvatarByIdApi } from '../../api/avatarApi';
import { virtualTryOnApi, virtualTryOnOutfitApi } from '../../api/tryOnApi';
import { addToLatestTryOnApi } from '../../api/userApi';
import { proxiedFetch } from '../../utils/proxiedFetch';

const imgSrc = image =>
  image?.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`;

const base64ToFile = (base64, filename) => {
  const url = imgSrc(base64);
  const [header, data] = url.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const ext = mime.split('/')[1];
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], `${filename}.${ext}`, { type: mime });
};

const CATEGORY_DISABLE_RULES = {
  top: ['top', 'dress'],
  bottom: ['bottom', 'dress'],
  dress: ['dress', 'top', 'bottom'],
};

const GALLERY_CATEGORIES = ['top', 'bottom', 'dress'];

const gradientBorder = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%23FF8A3D'/%3e%3cstop offset='50%25' stop-color='%2340B9FF'/%3e%3cstop offset='100%25' stop-color='%238ED321'/%3e%3c%2flinearGradient%3e%3c%2fdefs%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='url(%23g)' stroke-width='3' stroke-linecap='round'/%3e%3c%2fsvg%3e")`;

export default function TryOn() {
  const { user } = useAuth();
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe();
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const toastPosition = isArabic ? 'top-start' : 'top-end';

  const storeProduct = useMemo(
    () =>
      location.state?.productImage
        ? {
            image: location.state.productImage,
            name: location.state.productName || 'Product',
          }
        : null,
    [location.state],
  );

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [avatarBlob, setAvatarBlob] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [selectedItems, setSelectedItems] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);

  const resultRef = useRef(null);
  const galleryPreviewsRef = useRef([]);

  const handlePhotoSelected = files => {
    if (files && files.length > 0) {
      if (userPhoto) URL.revokeObjectURL(userPhoto);
      setUserPhoto(URL.createObjectURL(files[0]));
      setUserPhotoFile(files[0]);
    }
  };

  const MAX_GALLERY_FILES = 2;

  const handleGalleryFilesSelected = files => {
    setGalleryFiles(prev => {
      const remaining = MAX_GALLERY_FILES - prev.length;
      if (remaining <= 0) return prev;
      const toAdd = files.slice(0, remaining).map(f => ({
        file: f,
        preview: URL.createObjectURL(f),
      }));
      const next = [...prev, ...toAdd];
      galleryPreviewsRef.current = next.map(f => f.preview);
      return next;
    });
  };

  const handleRemoveGalleryImage = index => {
    setGalleryFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      const next = prev.filter((_, i) => i !== index);
      galleryPreviewsRef.current = next.map(f => f.preview);
      return next;
    });
  };

  const handleGalleryCategoryChange = (index, category) => {
    setGalleryFiles(prev => {
      const current = prev[index];
      if (!current) return prev;

      if (current.category === category) {
        const next = [...prev];
        next[index] = { ...next[index], category: null };
        return next;
      }

      for (let i = 0; i < prev.length; i++) {
        if (i === index) continue;
        const other = prev[i];
        if (!other.category) continue;
        const disables = CATEGORY_DISABLE_RULES[other.category];
        if (disables && disables.includes(category)) {
          showToast(
            'error',
            t('tryOn.categoryConflict', {
              cat1: category,
              cat2: other.category,
            }),
            toastPosition,
          );
          return prev;
        }
      }

      const next = [...prev];
      next[index] = { ...next[index], category };
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (userPhoto) URL.revokeObjectURL(userPhoto);
      galleryPreviewsRef.current.forEach(u => URL.revokeObjectURL(u));
    };
  }, []);

  useEffect(() => {
    if (!storeProduct) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(storeProduct.image);
        if (!cancelled && res.ok) {
          const blob = await res.blob();
          setProductImageFile(blob);
          setSelectedItems(['__product__']);
        }
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [storeProduct]);

  useEffect(() => {
    if (selectedModel !== 'avatar' || !user) return;
    const ids = user.avatars;
    if (!ids?.length) {
      setAvatarPreviewUrl(null);
      return;
    }
    let cancelled = false;
    setAvatarLoading(true);
    getAvatarByIdApi(ids[ids.length - 1])
      .then(async res => {
        if (cancelled) return;
        const url = res.data?.avatar?.image_url ?? null;
        setAvatarPreviewUrl(url);
        if (url) {
          try {
            const imgRes = await proxiedFetch(url);
            if (imgRes.ok) setAvatarBlob(await imgRes.blob());
          } catch {
            /* store null, handleGenerate will show error */
          }
        }
      })
      .catch(() => {
        if (!cancelled) setAvatarPreviewUrl(null);
      })
      .finally(() => {
        if (!cancelled) setAvatarLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedModel, user]);

  const steps = [
    {
      id: 1,
      title: t('tryOn.modelStep1Title'),
      subtitle: t('tryOn.modelStep1Subtitle'),
    },
    {
      id: 2,
      title: t('tryOn.modelStep2Title'),
      subtitle: t('tryOn.modelStep2Subtitle'),
    },
    {
      id: 3,
      title: t('tryOn.modelStep3Title'),
      subtitle: t('tryOn.modelStep3Subtitle'),
    },
  ];

  const currentStep =
    generating || generatedImageUrl ? 3 : selectedModel ? 2 : 1;
  const hasGalleryReady =
    activeTab === 'gallery' &&
    galleryFiles.length > 0 &&
    galleryFiles.every(f => f.category);
  const isReady =
    selectedModel && (selectedItems.length > 0 || hasGalleryReady);

  const MAX_SELECTION = 2;

  const disabledItemIds = useMemo(() => {
    const disabled = new Set();

    for (const selectedId of selectedItems) {
      const item = wardrobeItems.find(i => i._id === selectedId);
      if (!item) continue;
      const cat = (item.category || '').toLowerCase();
      const disables = CATEGORY_DISABLE_RULES[cat];
      if (!disables) continue;

      wardrobeItems.forEach(i => {
        if (!selectedItems.includes(i._id)) {
          const icat = (i.category || '').toLowerCase();
          if (disables.includes(icat)) {
            disabled.add(i._id);
          }
        }
      });
    }

    if (selectedItems.length >= MAX_SELECTION) {
      wardrobeItems.forEach(i => {
        if (!selectedItems.includes(i._id)) {
          disabled.add(i._id);
        }
      });
    }

    return disabled;
  }, [selectedItems, wardrobeItems]);

  const galleryDisabledCategories = useMemo(() => {
    const disabled = new Set();
    const assignedCats = galleryFiles
      .filter(f => f.category)
      .map(f => f.category);

    for (const cat of assignedCats) {
      const disables = CATEGORY_DISABLE_RULES[cat];
      if (disables) {
        disables.forEach(d => disabled.add(d));
      }
    }

    return disabled;
  }, [galleryFiles]);

  const toggleItem = id => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : prev.length >= MAX_SELECTION
          ? prev
          : [...prev, id],
    );
  };

  useEffect(() => {
    if (generatedImageUrl && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [generatedImageUrl]);

  const handleReset = () => {
    if (userPhoto) URL.revokeObjectURL(userPhoto);
    galleryPreviewsRef.current.forEach(u => URL.revokeObjectURL(u));
    galleryPreviewsRef.current = [];
    setSelectedModel(null);
    setSelectedItems([]);
    setGeneratedImageUrl(null);
    setUserPhoto(null);
    setUserPhotoFile(null);
    setGalleryFiles([]);
    setAvatarPreviewUrl(null);
    setAvatarBlob(null);
  };

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  const handleSave = async () => {
    if (!generatedImageUrl) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      await addToLatestTryOnApi({
        imageUrl: generatedImageUrl,
        model: selectedModel,
      });
      setSaveMsg('saved');
    } catch (err) {
      setSaveMsg('error');
      showToast('error', t('tryOn.generationError'), toastPosition);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!isReady) return;

    if (activeTab === 'gallery' && galleryFiles.length > 0) {
      const missingCategory = galleryFiles.some(f => !f.category);
      if (missingCategory) {
        Swal.fire({
          icon: 'warning',
          title: t('tryOn.categoryRequired'),
          text: t('tryOn.categoryRequiredText'),
          confirmButtonColor: '#3b82f6',
        });
        return;
      }
    }

    const details = {
      model: selectedModel,
      selectedItems: selectedItems,
      userPhoto: userPhotoFile
        ? {
            name: userPhotoFile.name,
            size: userPhotoFile.size,
            type: userPhotoFile.type,
          }
        : userPhoto
          ? 'blob url'
          : null,
      galleryFiles: galleryFiles.map(f => ({
        name: f.file.name,
        size: f.file.size,
        type: f.file.type,
      })),
      avatarBlob: avatarBlob
        ? { size: avatarBlob.size, type: avatarBlob.type }
        : null,
      avatarPreviewUrl,
    };
    console.log('🚀 [TryOn] Generate button clicked with details:', details);

    setGenerating(true);
    setGeneratedImageUrl(null);

    try {
      const formData = new FormData();

      if (selectedModel === 'photo') {
        if (userPhotoFile) {
          formData.append('personImage', userPhotoFile, userPhotoFile.name);
        } else if (userPhoto) {
          const res = await proxiedFetch(userPhoto);
          if (res.ok) {
            const blob = await res.blob();
            formData.append(
              'personImage',
              blob,
              `photo.${(blob.type || 'image/jpeg').split('/')[1]}`,
            );
          }
        }
      } else if (selectedModel === 'avatar') {
        if (avatarBlob) {
          formData.append(
            'personImage',
            avatarBlob,
            `avatar.${(avatarBlob.type || 'image/jpeg').split('/')[1]}`,
          );
        } else if (avatarPreviewUrl) {
          const res = await proxiedFetch(avatarPreviewUrl);
          if (!res.ok)
            throw new Error(`Failed to fetch avatar image (${res.status})`);
          const blob = await res.blob();
          formData.append(
            'personImage',
            blob,
            `avatar.${(blob.type || 'image/jpeg').split('/')[1]}`,
          );
        }
      }

      const logDetails = { model: selectedModel, items: [] };

      let resultUrl;
      if (storeProduct && productImageFile) {
        formData.append('garmentImage', productImageFile, 'product.jpg');
        logDetails.garmentImage = `File: product.jpg (${productImageFile.size} bytes, ${productImageFile.type})`;
        console.log(
          '🚀 [TryOn] Sending request to POST /api/virtual-tryon (store product)',
          logDetails,
        );
        const res = await virtualTryOnApi(formData);
        console.log('✅ [TryOn] Response:', res.data);
        resultUrl = res.data?.imageUrl;
      } else {
        const selectedWardrobeItems = wardrobeItems.filter(item =>
          selectedItems.includes(item._id),
        );

        for (const [key, val] of formData.entries()) {
          logDetails[key] =
            val instanceof File
              ? `File: ${val.name} (${val.size} bytes, ${val.type})`
              : val;
        }

        if (selectedWardrobeItems.length === 1) {
          const item = selectedWardrobeItems[0];
          const garmentFile = base64ToFile(item.image, 'garment');
          formData.append('garmentImage', garmentFile);
          logDetails.garmentImage = `File: ${garmentFile.name} (${garmentFile.size} bytes, ${garmentFile.type})`;
          console.log(
            '🚀 [TryOn] Sending request to POST /api/virtual-tryon',
            logDetails,
          );
          const res = await virtualTryOnApi(formData);
          console.log('✅ [TryOn] Response:', res.data);
          resultUrl = res.data?.imageUrl;
        } else if (selectedWardrobeItems.length === 2) {
          const [first, second] = selectedWardrobeItems;
          const topFile = base64ToFile(first.image, 'top');
          const bottomFile = base64ToFile(second.image, 'bottom');
          formData.append('topImage', topFile);
          formData.append('bottomImage', bottomFile);
          logDetails.topImage = `File: ${topFile.name} (${topFile.size} bytes, ${topFile.type})`;
          logDetails.bottomImage = `File: ${bottomFile.name} (${bottomFile.size} bytes, ${bottomFile.type})`;
          console.log(
            '🚀 [TryOn] Sending request to POST /api/virtual-tryon/outfit',
            logDetails,
          );
          const res = await virtualTryOnOutfitApi(formData);
          console.log('✅ [TryOn] Response:', res.data);
          resultUrl = res.data?.imageUrl;
        } else if (activeTab === 'gallery' && galleryFiles.length > 0) {
          if (galleryFiles.length === 1) {
            const file = galleryFiles[0].file;
            formData.append('garmentImage', file, file.name);
            logDetails.garmentImage = `File: ${file.name} (${file.size} bytes, ${file.type})`;
            console.log(
              '🚀 [TryOn] Sending request to POST /api/virtual-tryon (gallery)',
              logDetails,
            );
            const res = await virtualTryOnApi(formData);
            console.log('✅ [TryOn] Response:', res.data);
            resultUrl = res.data?.imageUrl;
          } else if (galleryFiles.length === 2) {
            const [first, second] = galleryFiles;
            formData.append('topImage', first.file, first.file.name);
            formData.append('bottomImage', second.file, second.file.name);
            logDetails.topImage = `File: ${first.file.name} (${first.file.size} bytes, ${first.file.type})`;
            logDetails.bottomImage = `File: ${second.file.name} (${second.file.size} bytes, ${second.file.type})`;
            console.log(
              '🚀 [TryOn] Sending request to POST /api/virtual-tryon/outfit (gallery)',
              logDetails,
            );
            const res = await virtualTryOnOutfitApi(formData);
            console.log('✅ [TryOn] Response:', res.data);
            resultUrl = res.data?.imageUrl;
          }
        }
      }

      if (resultUrl) setGeneratedImageUrl(resultUrl);
    } catch (err) {
      const errorPayload = err.response?.data || err.message || err;
      console.error(
        '❌ [TryOn] Error — model:',
        selectedModel,
        'items:',
        selectedItems,
        '|',
        errorPayload,
      );
      showToast('error', t('tryOn.generationError'), toastPosition);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--primary-bgc)',
        color: 'var(--Primary-Text-color)',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero / Title */}
        <section className="text-center mt-2 sm:mt-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl"
            style={{
              fontWeight: 'var(--Bold)',
              lineHeight: '1.2',
            }}
          >
            <span style={{ color: 'var(--Primary-Text-color)' }}>
              {t('tryOn.title')}{' '}
            </span>
            <span
              style={{
                background:
                  'linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('tryOn.subtitle')}
            </span>
          </h1>
          <p
            className="mt-3 text-base sm:text-lg md:text-xl"
            style={{
              color: 'var(--Primary-Text-color)',
              fontWeight: 'var(--Semi-Bold)',
              opacity: 0.85,
            }}
          >
            {t('tryOn.heroDesc')}
          </p>
        </section>

        {/* Step Indicator */}
        <section className="mt-8 sm:mt-10">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </section>

        {/* Model Selection */}
        <section className="mt-12 sm:mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-6xl mx-auto">
            <ModelSelectionCard
              selected={selectedModel === 'avatar'}
              onClick={() =>
                setSelectedModel(selectedModel === 'avatar' ? null : 'avatar')
              }
              media="/boyTryOn.png"
            >
              <h3 className="font-bold text-lg mt-2">{t('tryOn.avatar')}</h3>
              <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold">
                {t('tryOn.recommended')}
              </span>
              <p className="text-xs text-text-secondary max-w-[180px] mt-1">
                {t('tryOn.avatarDesc')}
              </p>
            </ModelSelectionCard>

            <ModelSelectionCard
              selected={selectedModel === 'photo'}
              onClick={() =>
                setSelectedModel(selectedModel === 'photo' ? null : 'photo')
              }
              media={
                <div className="w-24 h-24 bg-info-bg rounded-2xl flex flex-col items-center justify-center border border-dashed border-[var(--border)]">
                  <img
                    src="/cameraFrame.png"
                    alt=""
                    className="w-10 h-10 object-contain"
                  />
                  <span className="text-[10px] mt-1 text-info-text">
                    {t('tryOn.tapToUpload')}
                  </span>
                </div>
              }
            >
              <h3 className="font-bold text-lg">{t('tryOn.yourPhoto')}</h3>
              <p className="text-xs text-text-secondary max-w-[180px] mt-1">
                {t('tryOn.photoDesc')}
              </p>
            </ModelSelectionCard>
          </div>
        </section>

        {/* Model Preview */}
        {selectedModel === 'avatar' && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center transition-all duration-500">
              {avatarLoading ? (
                <div className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] w-full max-w-[300px] bg-[var(--bg-secondary)] flex items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
                </div>
              ) : avatarPreviewUrl ? (
                <img
                  src={avatarPreviewUrl}
                  alt="Avatar"
                  className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] object-cover"
                />
              ) : (
                <div
                  onClick={() => navigate('/avatar')}
                  className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] w-full max-w-[300px] bg-[var(--bg-secondary)] flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-info-bg flex items-center justify-center border-2 border-dashed border-[var(--border)] mb-3">
                    <Plus className="w-8 h-8 text-info-text" strokeWidth={2} />
                  </div>
                  <p className="text-sm text-text-secondary font-medium">
                    {t('tryOn.createAvatar')}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {selectedModel === 'photo' && !userPhoto && (
          <section className="mt-12 sm:mt-16">
            <div className="transition-all duration-500">
              <UploadArea onFilesSelected={handlePhotoSelected} maxFiles={1} />
            </div>
          </section>
        )}

        {selectedModel === 'photo' && userPhoto && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center transition-all duration-500">
              <div className="relative rounded-2xl p-4 sm:p-5 shadow-xl bg-info-bg">
                <div
                  className="relative overflow-hidden rounded-lg bg-surface-elevated"
                  style={{ width: '300px', aspectRatio: '3/4' }}
                >
                  <img
                    src={userPhoto}
                    alt="Uploaded"
                    className="h-full w-full object-contain"
                  />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(userPhoto);
                      setUserPhoto(null);
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated/90 text-text-secondary shadow-md transition-all duration-200 hover:bg-accent-orange hover:text-white hover:scale-110"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute left-6 bottom-6 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium bg-info-bg">
                  {t('tryOn.yourPhoto')}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Product Image Preview (from store) */}
        {storeProduct && productImageFile && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-6 items-center p-6 rounded-2xl bg-surface-elevated border border-[var(--border)] shadow-sm">
                <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-[var(--border)] flex-shrink-0">
                  <img
                    src={URL.createObjectURL(productImageFile)}
                    alt={storeProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-bold text-lg text-text-primary">
                    {storeProduct.name}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {t('tryOn.productPreselected')}
                  </p>
                  <p className="text-xs text-text-disabled mt-1">
                    {t('tryOn.selectModelAndGenerate')}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tabs */}
        {!storeProduct && (
          <section className="mt-12 sm:mt-16">
            <div className="flex gap-4 max-w-6xl mx-auto">
              <button
                onClick={() => setActiveTab('wardrobe')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'wardrobe'
                    ? 'bg-info-bg text-info-text border border-[var(--border)]'
                    : 'bg-[var(--bg-secondary)] text-text-disabled'
                }`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  <Shirt className="w-4 h-4" /> {t('tryOn.myWardrobe')}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'gallery'
                    ? 'bg-info-bg text-info-text border border-[var(--border)]'
                    : 'bg-[var(--bg-secondary)] text-text-disabled'
                }`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}
                >
                  <Grid3x3 className="w-4 h-4" /> {t('tryOn.tabsGallery')}
                </span>
              </button>
            </div>
          </section>
        )}

        {/* Wardrobe / Gallery Content */}
        {!storeProduct && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
              {activeTab === 'wardrobe' ? (
                <>
                  <div
                    className="flex items-center justify-between mb-5"
                    style={{ marginTop: '30px' }}
                  >
                    <h3
                      className="text-text-primary"
                      style={{ fontSize: '1.2rem', fontWeight: 700 }}
                    >
                      {t('tryOn.activeWardrobe')}
                    </h3>
                    <a
                      href="#"
                      className="text-text-secondary"
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      {t('tryOn.seeAll')}
                    </a>
                  </div>

                  {!user ? (
                    <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center">
                      <LogIn className="w-10 h-10 text-text-disabled mx-auto mb-3" />
                      <p className="text-text-secondary font-medium">
                        {t('tryOn.signInToView')}
                      </p>
                      <p className="text-xs text-text-disabled mt-1">
                        <a
                          href="/auth"
                          className="text-info-text hover:underline"
                        >
                          {t('tryOn.signIn')}
                        </a>{' '}
                        {t('tryOn.toAccessItems')}
                      </p>
                    </div>
                  ) : wardrobeLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
                    </div>
                  ) : wardrobeItems.length === 0 ? (
                    <EmptyState message={t('tryOn.wardrobeEmpty')} description={t('tryOn.addItemsToStart')} />
                  ) : (
                    <div className="flex gap-[15px] flex-wrap justify-center sm:justify-start">
                      {wardrobeItems.map(item => {
                        const isSelected = selectedItems.includes(item._id);
                        const isDisabled =
                          !isSelected && disabledItemIds.has(item._id);
                        return (
                          <WardrobeItem
                            key={item._id}
                            src={imgSrc(item.image)}
                            alt={item.name || t('tryOn.clothingItem')}
                            selected={isSelected}
                            disabled={isDisabled}
                            onClick={() => toggleItem(item._id)}
                          />
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {galleryFiles.length < 2 && (
                    <div className="mb-6">
                      <UploadArea
                        onFilesSelected={handleGalleryFilesSelected}
                        maxFiles={2}
                      />
                    </div>
                  )}
                  {galleryFiles.length > 0 && (
                    <div className="flex flex-wrap gap-6 sm:gap-8 justify-center sm:justify-start">
                      {galleryFiles.map((img, i) => (
                        <div
                          key={img.preview}
                          className={`relative transition-all duration-300 ease-in-out transform-gpu ${
                            img.category ? 'scale-[1.02]' : 'scale-100'
                          }`}
                        >
                          <div
                            className={`rounded-2xl transition-all duration-300 ease-in-out ${
                              img.category
                                ? 'shadow-lg shadow-blue-100/50'
                                : 'shadow-sm'
                            }`}
                            style={
                              img.category
                                ? {
                                    background: gradientBorder,
                                    padding: '3px',
                                  }
                                : {}
                            }
                          >
                            <UploadedImageCard
                              image={img}
                              index={i}
                              onRemove={handleRemoveGalleryImage}
                            />
                          </div>

                          {img.category && (
                            <div className="absolute -top-1.5 -right-1.5 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-md z-10">
                              <Check
                                className="w-4 h-4 text-white"
                                strokeWidth={3}
                              />
                            </div>
                          )}

                          <div className="mt-3 w-44 sm:w-52">
                            <p
                              className="text-xs font-semibold mb-2"
                              style={{ color: 'var(--Primary-Text-color)' }}
                            >
                              What type is this item?
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {GALLERY_CATEGORIES.map(cat => {
                                const isSelected = img.category === cat;
                                const isDisabled =
                                  galleryDisabledCategories.has(cat) &&
                                  !isSelected;
                                return (
                                  <button
                                    key={cat}
                                    type="button"
                                    disabled={isDisabled && !isSelected}
                                    onClick={() =>
                                      handleGalleryCategoryChange(i, cat)
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ease-in-out ${
                                      isSelected
                                        ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200 scale-105'
                                        : isDisabled
                                          ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
                                          : 'bg-white text-gray-600 border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm cursor-pointer active:scale-95'
                                    }`}
                                  >
                                    {isDisabled && (
                                      <Lock className="w-2.5 h-2.5 inline mr-1 -mt-0.5" />
                                    )}
                                    {cat}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {/* Status Bar */}
        <section className="mt-12 sm:mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center mb-4">
              <h3
                className="text-text-primary"
                style={{ fontSize: '1.2rem', fontWeight: 700 }}
              >
                {t('tryOn.selectedItems', { count: selectedItems.length })}
              </h3>
            </div>
            <div className="rounded-[15px] p-5 flex items-center gap-4 bg-info-bg">
              <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center shrink-0 bg-info-bg">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10 2c1 2 2.5 4 4.5 4a4.5 4.5 0 0 1 4.5 4.5V21a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10.5A4.5 4.5 0 0 1 9.5 6c2 0 3.5-2 4.5-4" />
                  <path d="m18 21-6-4-6 4" />
                </svg>
              </div>
              <div>
                <p
                  className="font-bold text-text-primary"
                  style={{ fontSize: '0.95rem' }}
                >
                  {selectedItems.length > 0
                    ? t('tryOn.itemsSelected')
                    : t('tryOn.noItemsSelected')}
                </p>
                <p
                  className="text-text-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  {selectedItems.length > 0
                    ? t('tryOn.youCanTryOn')
                    : t('tryOn.addItemsAbove')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Generate Button */}
        <section className="mt-12 sm:mt-16">
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={!isReady || generating}
              className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg w-full max-w-md justify-center ${
                isReady && !generating
                  ? 'bg-secondary hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer'
                  : 'bg-[var(--Disabled-Text-color)] cursor-not-allowed'
              } ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <Sparkles className="w-5 h-5" />
              {generating ? t('tryOn.generating') : t('tryOn.generateTryOn')}
            </button>
          </div>
        </section>

        {/* Result */}
        {generatedImageUrl && (
          <section ref={resultRef} className="mt-12 sm:mt-16">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-[var(--bg-secondary)]">
              <img
                src={generatedImageUrl}
                alt={t('tryOn.tryOnResult')}
                className="w-full h-auto max-h-[600px] object-contain"
              />
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: saving
                    ? 'var(--Disabled-Text-color)'
                    : 'var(--primary)',
                }}
              >
                {saving
                  ? t('tryOn.saving')
                  : saveMsg === 'saved'
                    ? t('tryOn.saved')
                    : saveMsg === 'error'
                      ? t('tryOn.failed')
                      : t('tryOn.save')}
              </button>
              <button
                onClick={handleReset}
                className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white bg-secondary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg ${isArabic ? 'flex-row-reverse' : ''}`}
              >
                <Sparkles className="w-5 h-5" />
                {t('tryOn.tryAgain')}
              </button>
            </div>
          </section>
        )}
      </div>
      <LoadingScreen visible={generating} />
    </div>
  );
}
