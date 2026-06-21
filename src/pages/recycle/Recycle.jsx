import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Shirt,
  Grid3x3,
  Sparkles,
  LogIn,
  X,
  Package,
  Circle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import StepIndicator from './components/StepIndicator';
import UploadArea from './components/UploadArea';
import EmptyState from '../../components/EmptyState';
import LoadingScreen from '../../components/LoadingScreen';
import UploadedImageCard from './components/UploadedImageCard';
import DesignIdeaCard from './components/DesignIdeaCard';
import SettingsRow from './components/SettingsRow';
import GeneratedDesign from './components/GeneratedDesign';
import WardrobeItem from '../../components/tryOn/WardrobeItem';
import { useAuth } from '../../context/AuthContext';
import { useWardrobe } from '../../context/WardrobeContext';
import {
  analyzeRecycleApi,
  generateRecycleIdeaApi,
} from '../../api/recycleApi';
import { addToLatestRecycleApi } from '../../api/userApi';
import { showToast } from '../../utils/toast';

const MAX_SELECTION = 2;

const imgSrc = image => {
  if (!image) return null;
  if (typeof image === 'string') {
    if (image.startsWith('data:') || image.startsWith('http')) return image;
    return `data:image/jpeg;base64,${image}`;
  }
  if (image.url) return image.url;
  if (image.uri) return image.uri;
  return null;
};

const base64ToFile = (base64, filename) => {
  const url = base64?.startsWith('data:')
    ? base64
    : `data:image/jpeg;base64,${base64}`;
  const [header, data] = url.split(',');
  const mime = header?.match(/:(.*?);/)?.[1] || 'image/jpeg';
  const ext = mime.split('/')[1] || 'jpg';
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], `${filename}.${ext}`, { type: mime });
};

const buildPreviews = async files => {
  const results = await Promise.all(
    files.map(
      file =>
        new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve({ file, preview: reader.result });
          reader.readAsDataURL(file);
        }),
    ),
  );
  return results;
};

export default function Recycle() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe();
  const navigate = useNavigate();
  const toastPosition = i18n.language === 'ar' ? 'top-start' : 'top-end';

  const [wardrobeSelectedIds, setWardrobeSelectedIds] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [model, setModel] = useState('qwen-image-2.0-pro');
  const [aspectRatio, setAspectRatio] = useState('1536*1024');
  const [generating, setGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);

  const ideasRef = useRef(null);
  const generateRef = useRef(null);
  const resultRef = useRef(null);

  const totalSelected = wardrobeSelectedIds.length + galleryFiles.length;
  const isReady = totalSelected >= 1;
  const remainingSlots = MAX_SELECTION - totalSelected;

  const steps = [
    {
      id: 1,
      title: t('recycle.selectItemsStep'),
      subtitle: t('recycle.chooseItemsStep'),
    },
    {
      id: 2,
      title: t('recycle.getIdeasStep'),
      subtitle: t('recycle.aiGeneratesStep'),
    },
    {
      id: 3,
      title: t('recycle.generateDesignStep'),
      subtitle: t('recycle.createDesignStep'),
    },
  ];

  const currentStep = generating ? 3 : ideas.length > 0 ? 2 : 1;

  const selectedTitle =
    totalSelected > 0
      ? t('recycle.itemsSelected', { count: totalSelected })
      : t('recycle.noItemsSelectedYet');

  const selectedSubtitle =
    totalSelected > 0
      ? t('recycle.selectUpTo')
      : t('recycle.selectFromWardrobe');

  const selectedIdea = useMemo(
    () => ideas.find(i => i.id === selectedIdeaId) || null,
    [ideas, selectedIdeaId],
  );

  useEffect(() => {
    return () => {
      galleryFiles.forEach(img => {
        if (img.preview && img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [galleryFiles]);

  useEffect(() => {
    if (ideas.length > 0 && ideasRef.current) {
      ideasRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [ideas]);

  useEffect(() => {
    if (selectedIdeaId && generateRef.current) {
      generateRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [selectedIdeaId]);

  useEffect(() => {
    if ((generating || generatedIdea) && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }
  }, [generating, generatedIdea]);

  const toggleWardrobeItem = id => {
    setWardrobeSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(i => i !== id);
      if (prev.length + galleryFiles.length >= MAX_SELECTION) return prev;
      return [...prev, id];
    });
  };

  const handleGalleryFilesSelected = async files => {
    const allowed = remainingSlots > 0 ? files.slice(0, remainingSlots) : [];
    if (allowed.length === 0) return;
    const previews = await buildPreviews(allowed);
    setGalleryFiles(prev => [...prev, ...previews]);
  };

  const handleRemoveGalleryImage = index => {
    setGalleryFiles(prev => {
      const img = prev[index];
      if (img?.preview?.startsWith('blob:')) URL.revokeObjectURL(img.preview);
      return prev.filter((_, i) => i !== index);
    });
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);
  };

  const handleRecycle = async () => {
    if (!isReady) return;
    setAnalyzing(true);
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);

    try {
      const formData = new FormData();

      const selectedWardrobeItems = wardrobeItems.filter(item =>
        wardrobeSelectedIds.includes(item._id),
      );
      selectedWardrobeItems.forEach(item => {
        const file = base64ToFile(item.image, `wardrobe_${item._id}`);
        formData.append('images', file);
      });

      galleryFiles.forEach(gf => {
        formData.append('images', gf.file);
      });

      const res = await analyzeRecycleApi(formData);
      const data = res.data || {};
      setSessionId(data.session_id);
      setIdeas(data.ideas || []);
    } catch (err) {
      showToast('error', t('recycle.analysisFailed'), toastPosition);
    } finally {
      setAnalyzing(false);
    }

    setTimeout(() => {
      ideasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
  };

  const handleGenerate = async () => {
    if (!sessionId || !selectedIdeaId) return;
    setGenerating(true);
    setGeneratedImageUrl(null);
    setGeneratedIdea(selectedIdea);
    try {
      const res = await generateRecycleIdeaApi(
        sessionId,
        selectedIdeaId,
        model,
        aspectRatio,
      );
      const data = res.data || {};
      if (data.image_url) {
        setGeneratedImageUrl(data.image_url);
        try {
          await addToLatestRecycleApi({
            imageUrl: data.image_url,
            designTitle: selectedIdea?.title || '',
            designTitleAr: selectedIdea?.title_ar || '',
            designDescription: selectedIdea?.design_description || '',
            designDescriptionAr: selectedIdea?.design_description_ar || '',
          });
        } catch (e) {
          console.error('Failed to save recycle result:', e);
        }
      } else {
        showToast('error', t('recycle.generationError'), toastPosition);
      }
    } catch (err) {
      showToast('error', t('recycle.generationFailed'), toastPosition);
    } finally {
      setGenerating(false);
    }
  };

  const handleReset = () => {
    galleryFiles.forEach(img => {
      if (img.preview?.startsWith('blob:')) URL.revokeObjectURL(img.preview);
    });
    setWardrobeSelectedIds([]);
    setGalleryFiles([]);
    setAnalyzing(false);
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);
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
              Redolapy{' '}
            </span>
            <span
              style={{
                background:
                  'linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {t('recycle.subtitle')}
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
            {t('recycle.heroDesc')}
          </p>
        </section>

        {/* Step Indicator */}
        <section className="mt-8 sm:mt-10">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </section>

        {/* Wardrobe Section */}
        <section className="mt-12 sm:mt-16">
          <div className="max-w-6xl mx-auto">
            {!user ? (
              <div className="bg-[var(--bg-secondary)] rounded-xl p-8 text-center">
                <LogIn className="w-10 h-10 text-text-disabled mx-auto mb-3" />
                <p className="text-text-secondary font-medium">
                  {t('recycle.signInToView')}
                </p>
                <p className="text-xs text-text-disabled mt-1">
                  <span
                    onClick={() => navigate('/auth')}
                    className="text-info-text hover:underline cursor-pointer"
                  >
                    {t('recycle.signInLink')}
                  </span>{' '}
                  {t('recycle.toAccessItems')}
                </p>
              </div>
            ) : wardrobeLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--primary)]" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <Shirt className="w-5 h-5 text-info-text" />
                  <h3 className="font-bold text-lg text-text-primary">
                    {t('recycle.fromMyWardrobe')}
                  </h3>
                  {remainingSlots < MAX_SELECTION && (
                    <span className="text-xs text-text-disabled ltr:ml-auto rtl:mr-auto">
                      {remainingSlots > 0
                        ? t('recycle.slotsLeft', { count: remainingSlots })
                        : t('recycle.maxReached')}
                    </span>
                  )}
                </div>

                {wardrobeItems.length === 0 ? (
                  <EmptyState message={t('recycle.wardrobeEmpty')} />
                ) : (
                  <div className="flex gap-[15px] flex-wrap">
                    {wardrobeItems.map(item => {
                      const isSelected = wardrobeSelectedIds.includes(item._id);
                      const canSelect =
                        isSelected || totalSelected < MAX_SELECTION;
                      return (
                        <WardrobeItem
                          key={item._id}
                          src={imgSrc(item.image)}
                          alt={item.name || 'Clothing item'}
                          selected={isSelected}
                          disabled={!canSelect}
                          onClick={() => toggleWardrobeItem(item._id)}
                        />
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Gallery Section */}
        <section className="mt-10 sm:mt-14 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <Grid3x3 className="w-5 h-5 text-info-text" />
            <h3 className="font-bold text-lg text-text-primary">
              {t('recycle.uploadImages')}
            </h3>
            {remainingSlots < MAX_SELECTION && (
              <span className="text-xs text-text-disabled ml-auto">
                {remainingSlots > 0
                  ? t('recycle.slotsLeft', { count: remainingSlots })
                  : t('recycle.maxReached')}
              </span>
            )}
          </div>

          {galleryFiles.length < MAX_SELECTION && remainingSlots > 0 && (
            <UploadArea
              onFilesSelected={handleGalleryFilesSelected}
              disabled={analyzing || generating}
              maxFiles={remainingSlots}
            />
          )}

          {galleryFiles.length > 0 && (
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
              {galleryFiles.map((img, idx) => (
                <UploadedImageCard
                  key={idx}
                  image={img}
                  index={idx}
                  onRemove={handleRemoveGalleryImage}
                />
              ))}
            </div>
          )}
        </section>

        {/* Selected Items Status */}
        {!ideas.length && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="rounded-[15px] p-5 flex items-center gap-4 bg-info-bg">
                <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center shrink-0 bg-info-bg">
                  <Package
                    className="w-5 h-5"
                    style={{ color: 'var(--Primary-Text-color)' }}
                  />
                </div>
                <div>
                  <p
                    className="font-bold text-text-primary"
                    style={{ fontSize: '0.95rem' }}
                  >
                    {selectedTitle}
                  </p>
                  <p
                    className="text-text-secondary"
                    style={{ fontSize: '0.85rem' }}
                  >
                    {selectedSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recycle Button */}
        {!analyzing && !ideas.length && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center">
              <button
                onClick={handleRecycle}
                disabled={!isReady}
                className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg w-full max-w-md justify-center ${
                  isReady
                    ? 'bg-secondary hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-[var(--Disabled-Text-color)] cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                {t('recycle.recycleButton')}
              </button>
            </div>
          </section>
        )}

        {/* Design Ideas Section */}
        {ideas.length > 0 && (
          <section ref={ideasRef} className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between max-w-6xl mx-auto mb-8 sm:mb-14 px-1 gap-4 flex-wrap">
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold"
                style={{ color: 'var(--Secondary-Text-color)' }}
              >
                {t('recycle.designIdeas')}
              </h2>
              <span
                className="inline-flex items-center rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white"
                style={{ backgroundColor: 'var(--Secondary-Brand-color)' }}
              >
                {t('recycle.aiSuggested')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto items-start">
              {ideas.map((idea, idx) => (
                <DesignIdeaCard
                  key={idea.id}
                  idea={idea}
                  index={idx}
                  selected={selectedIdeaId}
                  onSelect={setSelectedIdeaId}
                  disabled={generating}
                />
              ))}
            </div>

            {/* Settings Row */}
            <div className="mt-8 sm:mt-10">
              <SettingsRow
                model={model}
                setModel={setModel}
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
              />
            </div>

            {/* Generate Button */}
            <div ref={generateRef} className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!selectedIdeaId || generating}
                className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg w-full max-w-md justify-center ${
                  !selectedIdeaId || generating
                    ? 'bg-[var(--Disabled-Text-color)] cursor-not-allowed'
                    : 'bg-secondary hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                {generating ? t('recycle.generatingDesignBtn') : t('recycle.generateDesignBtn')}
              </button>
            </div>
          </section>
        )}

        {/* Generated Design Section */}
        {(generating || generatedIdea) && (
          <div ref={resultRef}>
            <GeneratedDesign
              idea={generatedIdea}
              imageUrl={generatedImageUrl}
              loading={generating}
            />
          </div>
        )}

        {/* Try Again */}
        {ideas.length > 0 && !generating && !generatedIdea && (
          <div className="flex justify-center pb-10 mt-16">
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 w-full max-w-md py-4 rounded-xl font-bold text-white bg-secondary hover:opacity-90 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              {t('recycle.tryAgain')}
            </button>
          </div>
        )}
      </div>
      <LoadingScreen visible={analyzing || generating} />
    </div>
  );
}
