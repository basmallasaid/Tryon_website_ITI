import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Shirt, Grid3x3, X, LogIn, Plus } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import StepIndicator from "../recycle/components/StepIndicator";
import UploadArea from "../recycle/components/UploadArea";
import UploadedImageCard from "../recycle/components/UploadedImageCard";
import ModelSelectionCard from "../../components/tryOn/ModelSelectionCard";
import WardrobeItem from "../../components/tryOn/WardrobeItem";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { getAvatarByIdApi } from "../../api/avatarApi";
import { virtualTryOnApi, virtualTryOnOutfitApi } from "../../api/tryOnApi";
import { addToLatestTryOnApi } from "../../api/userApi";
import { proxiedFetch } from "../../utils/proxiedFetch";

const imgSrc = (image) =>
  image?.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`;

const base64ToFile = (base64, filename) => {
  const url = imgSrc(base64);
  const [header, data] = url.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const ext = mime.split("/")[1];
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], `${filename}.${ext}`, { type: mime });
};

export default function TryOn() {
  const { user } = useAuth();
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe();
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const storeProduct = useMemo(
    () => location.state?.productImage
      ? { image: location.state.productImage, name: location.state.productName || 'Product' }
      : null,
    [location.state]
  );

  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(null);
  const [avatarBlob, setAvatarBlob] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [galleryFiles, setGalleryFiles] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);
  const [activeTab, setActiveTab] = useState("wardrobe");
  const [selectedItems, setSelectedItems] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [generateError, setGenerateError] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [productImageFile, setProductImageFile] = useState(null);

  const resultRef = useRef(null);
  const galleryPreviewsRef = useRef([]);

  const handlePhotoSelected = (files) => {
    if (files && files.length > 0) {
      if (userPhoto) URL.revokeObjectURL(userPhoto);
      setUserPhoto(URL.createObjectURL(files[0]));
      setUserPhotoFile(files[0]);
    }
  };

  const MAX_GALLERY_FILES = 2;

  const handleGalleryFilesSelected = (files) => {
    setGalleryFiles((prev) => {
      const remaining = MAX_GALLERY_FILES - prev.length;
      if (remaining <= 0) return prev;
      const toAdd = files.slice(0, remaining).map((f) => ({
        file: f,
        preview: URL.createObjectURL(f),
      }));
      const next = [...prev, ...toAdd];
      galleryPreviewsRef.current = next.map((f) => f.preview);
      return next;
    });
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      const next = prev.filter((_, i) => i !== index);
      galleryPreviewsRef.current = next.map((f) => f.preview);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (userPhoto) URL.revokeObjectURL(userPhoto);
      galleryPreviewsRef.current.forEach((u) => URL.revokeObjectURL(u));
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
    return () => { cancelled = true; };
  }, [storeProduct]);

  useEffect(() => {
    if (selectedModel !== "avatar" || !user) return;
    const ids = user.avatars;
    if (!ids?.length) {
      setAvatarPreviewUrl(null);
      return;
    }
    let cancelled = false;
    setAvatarLoading(true);
    getAvatarByIdApi(ids[0])
      .then(async (res) => {
        if (cancelled) return;
        const url = res.data?.avatar?.image_url ?? null;
        setAvatarPreviewUrl(url);
        if (url) {
          try {
            const imgRes = await proxiedFetch(url);
            if (imgRes.ok) setAvatarBlob(await imgRes.blob());
          } catch { /* store null, handleGenerate will show error */ }
        }
      })
      .catch(() => {
        if (!cancelled) setAvatarPreviewUrl(null);
      })
      .finally(() => {
        if (!cancelled) setAvatarLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedModel, user]);

  const steps = [
    { id: 1, title: t("tryOn.modelStep1Title"), subtitle: t("tryOn.modelStep1Subtitle") },
    { id: 2, title: t("tryOn.modelStep2Title"), subtitle: t("tryOn.modelStep2Subtitle") },
    { id: 3, title: t("tryOn.modelStep3Title"), subtitle: t("tryOn.modelStep3Subtitle") },
  ];

  const currentStep = generating || generatedImageUrl ? 3 : selectedModel ? 2 : 1;
  const isReady = selectedModel && selectedItems.length > 0;

  const MAX_SELECTION = 2;

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : prev.length >= MAX_SELECTION
          ? prev
          : [...prev, id]
    );
  };

  useEffect(() => {
    if ((generatedImageUrl || generateError) && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [generatedImageUrl, generateError]);

  const handleReset = () => {
    if (userPhoto) URL.revokeObjectURL(userPhoto);
    galleryPreviewsRef.current.forEach((u) => URL.revokeObjectURL(u));
    galleryPreviewsRef.current = [];
    setSelectedModel(null);
    setSelectedItems([]);
    setGeneratedImageUrl(null);
    setGenerateError(null);
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
      await addToLatestTryOnApi({ imageUrl: generatedImageUrl, model: selectedModel });
      setSaveMsg("saved");
    } catch (err) {
      setSaveMsg("error");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    if (!isReady) return;

    const details = {
      model: selectedModel,
      selectedItems: selectedItems,
      userPhoto: userPhotoFile ? { name: userPhotoFile.name, size: userPhotoFile.size, type: userPhotoFile.type } : userPhoto ? "blob url" : null,
      galleryFiles: galleryFiles.map((f) => ({ name: f.file.name, size: f.file.size, type: f.file.type })),
      avatarBlob: avatarBlob ? { size: avatarBlob.size, type: avatarBlob.type } : null,
      avatarPreviewUrl,
    };
    console.log("🚀 [TryOn] Generate button clicked with details:", details);

    setGenerating(true);
    setGeneratedImageUrl(null);
    setGenerateError(null);

    try {
      const formData = new FormData();

      if (selectedModel === "photo") {
        if (userPhotoFile) {
          formData.append("personImage", userPhotoFile, userPhotoFile.name);
        } else if (userPhoto) {
          const res = await proxiedFetch(userPhoto);
          if (res.ok) {
            const blob = await res.blob();
            formData.append("personImage", blob, `photo.${(blob.type || "image/jpeg").split("/")[1]}`);
          }
        }
      } else if (selectedModel === "avatar") {
        if (avatarBlob) {
          formData.append("personImage", avatarBlob, `avatar.${(avatarBlob.type || "image/jpeg").split("/")[1]}`);
        } else if (avatarPreviewUrl) {
          const res = await proxiedFetch(avatarPreviewUrl);
          if (!res.ok) throw new Error(`Failed to fetch avatar image (${res.status})`);
          const blob = await res.blob();
          formData.append("personImage", blob, `avatar.${(blob.type || "image/jpeg").split("/")[1]}`);
        }
      }

      const logDetails = { model: selectedModel, items: [] };

      let resultUrl;
      if (storeProduct && productImageFile) {
        formData.append("garmentImage", productImageFile, "product.jpg");
        logDetails.garmentImage = `File: product.jpg (${productImageFile.size} bytes, ${productImageFile.type})`;
        console.log("🚀 [TryOn] Sending request to POST /api/virtual-tryon (store product)", logDetails);
        const res = await virtualTryOnApi(formData);
        console.log("✅ [TryOn] Response:", res.data);
        resultUrl = res.data?.imageUrl;
      } else {
        const selectedWardrobeItems = wardrobeItems.filter((item) =>
          selectedItems.includes(item._id)
        );

        for (const [key, val] of formData.entries()) {
          logDetails[key] = val instanceof File ? `File: ${val.name} (${val.size} bytes, ${val.type})` : val;
        }

        if (selectedWardrobeItems.length === 1) {
        const item = selectedWardrobeItems[0];
        const garmentFile = base64ToFile(item.image, "garment");
        formData.append("garmentImage", garmentFile);
        logDetails.garmentImage = `File: ${garmentFile.name} (${garmentFile.size} bytes, ${garmentFile.type})`;
        console.log("🚀 [TryOn] Sending request to POST /api/virtual-tryon", logDetails);
        const res = await virtualTryOnApi(formData);
        console.log("✅ [TryOn] Response:", res.data);
        resultUrl = res.data?.imageUrl;
      } else if (selectedWardrobeItems.length === 2) {
        const [first, second] = selectedWardrobeItems;
        const topFile = base64ToFile(first.image, "top");
        const bottomFile = base64ToFile(second.image, "bottom");
        formData.append("topImage", topFile);
        formData.append("bottomImage", bottomFile);
        logDetails.topImage = `File: ${topFile.name} (${topFile.size} bytes, ${topFile.type})`;
        logDetails.bottomImage = `File: ${bottomFile.name} (${bottomFile.size} bytes, ${bottomFile.type})`;
        console.log("🚀 [TryOn] Sending request to POST /api/virtual-tryon/outfit", logDetails);
        const res = await virtualTryOnOutfitApi(formData);
        console.log("✅ [TryOn] Response:", res.data);
        resultUrl = res.data?.imageUrl;
      }
      }

      if (resultUrl) setGeneratedImageUrl(resultUrl);
    } catch (err) {
      const errorPayload = err.response?.data || err.message || err;
      console.error("❌ [TryOn] Error — model:", selectedModel, "items:", selectedItems, "|", errorPayload);
      setGenerateError(
        err.response?.data?.error || err.message || t("tryOn.generationFailed")
      );
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--primary-bgc)",
        color: "var(--Primary-Text-color)",
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Hero / Title */}
        <section className="text-center mt-2 sm:mt-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl"
            style={{
              fontWeight: "var(--Bold)",
              lineHeight: "1.2",
            }}
          >
            <span style={{ color: "var(--Primary-Text-color)" }}>{t("tryOn.title")} </span>
            <span
              style={{
                background: "linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("tryOn.subtitle")}
            </span>
          </h1>
          <p
            className="mt-3 text-base sm:text-lg md:text-xl"
            style={{
              color: "var(--Primary-Text-color)",
              fontWeight: "var(--Semi-Bold)",
              opacity: 0.85,
            }}
          >
            {t("tryOn.heroDesc")}
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
              selected={selectedModel === "avatar"}
              onClick={() => setSelectedModel(selectedModel === "avatar" ? null : "avatar")}
              media="/boyTryOn.png"
            >
              <h3 className="font-bold text-lg mt-2">{t("tryOn.avatar")}</h3>
              <span className="bg-[#40B9FF] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold">
                {t("tryOn.recommended")}
              </span>
              <p className="text-xs text-gray-500 max-w-[180px] mt-1">
                {t("tryOn.avatarDesc")}
              </p>
            </ModelSelectionCard>

            <ModelSelectionCard
              selected={selectedModel === "photo"}
              onClick={() => setSelectedModel(selectedModel === "photo" ? null : "photo")}
              media={
                <div className="w-24 h-24 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-blue-200">
                  <img src="/cameraFrame.png" alt="" className="w-10 h-10 object-contain" />
                  <span className="text-[10px] mt-1 text-blue-400">{t("tryOn.tapToUpload")}</span>
                </div>
              }
            >
              <h3 className="font-bold text-lg">{t("tryOn.yourPhoto")}</h3>
              <p className="text-xs text-gray-500 max-w-[180px] mt-1">
                {t("tryOn.photoDesc")}
              </p>
            </ModelSelectionCard>
          </div>
        </section>

        {/* Model Preview */}
        {selectedModel === "avatar" && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center transition-all duration-500">
            {avatarLoading ? (
              <div className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] w-full max-w-[300px] bg-gray-100 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              </div>
            ) : avatarPreviewUrl ? (
              <img
                src={avatarPreviewUrl}
                alt="Avatar"
                className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] object-cover"
              />
            ) : (
              <div
                onClick={() => navigate("/avatar")}
                className="rounded-3xl shadow-xl h-[350px] sm:h-[450px] w-full max-w-[300px] bg-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-dashed border-blue-200 mb-3">
                  <Plus className="w-8 h-8 text-blue-400" strokeWidth={2} />
                </div>
                <p className="text-sm text-gray-500 font-medium">{t("tryOn.createAvatar")}</p>
              </div>
            )}
          </div>
        </section>
        )}

        {selectedModel === "photo" && !userPhoto && (
          <section className="mt-12 sm:mt-16">
            <div className="transition-all duration-500">
              <UploadArea onFilesSelected={handlePhotoSelected} maxFiles={1} />
            </div>
          </section>
        )}

        {selectedModel === "photo" && userPhoto && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center transition-all duration-500">
            <div className="relative rounded-2xl p-4 sm:p-5 shadow-xl" style={{ backgroundColor: "#E9EDFF" }}>
              <div className="relative overflow-hidden rounded-lg bg-white" style={{ width: "300px", aspectRatio: "3/4" }}>
                <img
                  src={userPhoto}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
                <button
                  onClick={() => { URL.revokeObjectURL(userPhoto); setUserPhoto(null); }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div
                className="absolute left-6 bottom-6 inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium"
                style={{ backgroundColor: "#FAF8FF" }}
              >
                {t("tryOn.yourPhoto")}
              </div>
            </div>
          </div>
        </section>
        )}

        {/* Product Image Preview (from store) */}
        {storeProduct && productImageFile && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex gap-6 items-center p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
                <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-blue-100 flex-shrink-0">
                  <img src={URL.createObjectURL(productImageFile)} alt={storeProduct.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-800">{storeProduct.name}</p>
                  <p className="text-sm text-gray-500 mt-1">{t("tryOn.productPreselected")}</p>
                  <p className="text-xs text-gray-400 mt-1">{t("tryOn.selectModelAndGenerate")}</p>
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
            onClick={() => setActiveTab("wardrobe")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === "wardrobe"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-[#E9EBEE] text-gray-400"
            }`}
          >
            <span className={`inline-flex items-center gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}><Shirt className="w-4 h-4" /> {t("tryOn.myWardrobe")}</span>
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === "gallery"
                ? "bg-blue-50 text-blue-600 border border-blue-200"
                : "bg-[#E9EBEE] text-gray-400"
            }`}
          >
            <span className={`inline-flex items-center gap-1.5 ${isArabic ? 'flex-row-reverse' : ''}`}><Grid3x3 className="w-4 h-4" /> {t("tryOn.tabsGallery")}</span>
          </button>
        </div>
        </section>
        )}

        {/* Wardrobe / Gallery Content */}
        {!storeProduct && (
        <section className="mt-12 sm:mt-16">
          <div className="max-w-6xl mx-auto">
          {activeTab === "wardrobe" ? (
            <>
              <div className="flex items-center justify-between mb-5" style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#1a202c", fontSize: "1.2rem", fontWeight: 700 }}>{t("tryOn.activeWardrobe")}</h3>
                <a href="#" style={{ color: "#4a5568", fontSize: "0.9rem", fontWeight: 600, textDecoration: "none" }}>{t("tryOn.seeAll")}</a>
              </div>

              {!user ? (
                <div className="bg-gray-100 rounded-xl p-8 text-center">
                  <LogIn className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">{t("tryOn.signInToView")}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    <a href="/auth" className="text-blue-500 hover:underline">{t("tryOn.signIn")}</a> {t("tryOn.toAccessItems")}
                  </p>
                </div>
              ) : wardrobeLoading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                </div>
              ) : wardrobeItems.length === 0 ? (
                <div className="bg-gray-100 rounded-xl p-8 text-center">
                  <Shirt className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">{t("tryOn.wardrobeEmpty")}</p>
                  <p className="text-xs text-gray-400 mt-1">{t("tryOn.addItemsToStart")}</p>
                </div>
              ) : (
                <div className="flex gap-[15px] flex-wrap justify-center sm:justify-start">
                  {wardrobeItems.map((item) => (
                    <WardrobeItem
                      key={item._id}
                      src={imgSrc(item.image)}
                      alt={item.name || t("tryOn.clothingItem")}
                      selected={selectedItems.includes(item._id)}
                      disabled={!selectedItems.includes(item._id) && selectedItems.length >= MAX_SELECTION}
                      onClick={() => toggleItem(item._id)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {galleryFiles.length < 2 && (
                <div className="mb-6">
                  <UploadArea onFilesSelected={handleGalleryFilesSelected} maxFiles={2} />
                </div>
              )}
              {galleryFiles.length > 0 && (
                <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start">
                  {galleryFiles.map((img, i) => (
                    <UploadedImageCard
                      key={img.preview}
                      image={img}
                      index={i}
                      onRemove={handleRemoveGalleryImage}
                    />
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
            <h3 style={{ color: "#1a202c", fontSize: "1.2rem", fontWeight: 700 }}>
              {t("tryOn.selectedItems", { count: selectedItems.length })}
            </h3>
          </div>
          <div
            className="rounded-[15px] p-5 flex items-center gap-4"
            style={{ backgroundColor: "#edf2ff" }}
          >
            <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#dbeafe" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2c1 2 2.5 4 4.5 4a4.5 4.5 0 0 1 4.5 4.5V21a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V10.5A4.5 4.5 0 0 1 9.5 6c2 0 3.5-2 4.5-4" />
                <path d="m18 21-6-4-6 4" />
              </svg>
            </div>
            <div>
              <p className="font-bold" style={{ color: "#1e293b", fontSize: "0.95rem" }}>
                {selectedItems.length > 0
                  ? t("tryOn.itemsSelected")
                  : t("tryOn.noItemsSelected")}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                {selectedItems.length > 0
                  ? t("tryOn.youCanTryOn")
                  : t("tryOn.addItemsAbove")}
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
                ? "bg-lime-500 hover:bg-lime-600 hover:scale-105 active:scale-95 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            } ${isArabic ? 'flex-row-reverse' : ''}`}
          >
            {generating ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {t("tryOn.generating")}
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                {t("tryOn.generateTryOn")}
              </>
            )}
          </button>
        </div>
        </section>

        {/* Result */}
        {(generating || generatedImageUrl || generateError) && (
          <section ref={resultRef} className="mt-12 sm:mt-16">
            {generating ? (
              <div className="rounded-2xl shadow-xl bg-gray-100 flex flex-col items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mb-4" />
                <p className="text-gray-500 font-medium">{t("tryOn.generatingTryOn")}</p>
              </div>
            ) : generateError ? (
              <div className="rounded-2xl shadow-xl bg-red-50 border border-red-200 p-8 text-center">
                <p className="text-red-600 font-medium mb-2">{t("tryOn.somethingWentWrong")}</p>
                <p className="text-sm text-red-500">{generateError}</p>
                <button
                  onClick={handleReset}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-lime-500 hover:bg-lime-600 transition-all shadow-lg"
                >
                  {t("tryOn.tryAgain")}
                </button>
              </div>
            ) : (
              <>
                <div className="rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                  <img
                    src={generatedImageUrl}
                    alt={t("tryOn.tryOnResult")}
                    className="w-full h-auto max-h-[600px] object-contain"
                  />
                </div>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg hover:scale-105 active:scale-95"
                    style={{ backgroundColor: saving ? "#9ca3af" : "#3b82f6" }}
                  >
                    {saving ? t("tryOn.saving") : saveMsg === "saved" ? t("tryOn.saved") : saveMsg === "error" ? t("tryOn.failed") : t("tryOn.save")}
                  </button>
                  <button
                    onClick={handleReset}
                    className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white bg-lime-500 hover:bg-lime-600 hover:scale-105 active:scale-95 transition-all shadow-lg ${isArabic ? 'flex-row-reverse' : ''}`}
                  >
                    <Sparkles className="w-5 h-5" />
                    {t("tryOn.tryAgain")}
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
