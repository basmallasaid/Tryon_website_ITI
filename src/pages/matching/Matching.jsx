import { useEffect, useRef, useState } from "react";
import { Shirt, Grid3x3, Sparkles, LogIn, X, Circle, Package, Heart, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import StepIndicator from "../recycle/components/StepIndicator";
import UploadArea from "../recycle/components/UploadArea";
import WardrobeItem from "../../components/tryOn/WardrobeItem";
import { useAuth } from "../../context/AuthContext";
import { useWardrobe } from "../../context/WardrobeContext";
import { useFavorites } from "../../context/FavoritesContext";
import {
  getWardrobeMatches,
  analyzeImage,
  getMatchesByAnalysis,
} from "../../api/matchingApi";
import { getAllProducts } from "../../api/userApi";

const imgSrc = (image) => {
  if (!image) return null;
  if (typeof image === "string") {
    if (image.startsWith("data:") || image.startsWith("http")) return image;
    return `data:image/jpeg;base64,${image}`;
  }
  if (image.url) return image.url;
  if (image.uri) return image.uri;
  return null;
};

const base64ToFile = (base64, filename) => {
  const url = base64?.startsWith("data:") ? base64 : `data:image/jpeg;base64,${base64}`;
  const [header, data] = url.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const ext = mime.split("/")[1];
  const bytes = atob(data);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], `${filename}.${ext}`, { type: mime });
};

export default function Matching() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { user } = useAuth();
  const { items: wardrobeItems, loading: wardrobeLoading } = useWardrobe();
  const { isFavorite, addItem, removeItem } = useFavorites();
  const navigate = useNavigate();

  const [itemSource, setItemSource] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [wardrobeMatches, setWardrobeMatches] = useState([]);
  const [storeMatches, setStoreMatches] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const resultRef = useRef(null);

  const steps = [
    { id: 1, title: t("matching.step1Title"), subtitle: t("matching.step1Subtitle") },
    { id: 2, title: t("matching.step2Title"), subtitle: t("matching.step2Subtitle") },
    { id: 3, title: t("matching.step3Title"), subtitle: t("matching.step3Subtitle") },
  ];

  const currentStep = showResults ? 3 : isLoading ? 2 : (selectedItemId || galleryFile) ? 2 : 1;
  const isReady = (itemSource === "wardrobe" && selectedItemId) || (itemSource === "gallery" && galleryFile);

  const hasItem = !!selectedItemId || !!galleryFile;
  const selectedTitle = hasItem ? t("matching.oneItemSelected") : t("matching.noItemsSelected");
  const selectedSubtitle = hasItem
    ? selectedItemId
      ? t("matching.itemFromWardrobe")
      : t("matching.itemFromGallery")
    : t("matching.selectItemHint");

  const handleGalleryFileSelected = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (galleryPreview) URL.revokeObjectURL(galleryPreview);
      setGalleryFile(file);
      setGalleryPreview(URL.createObjectURL(file));
      setSelectedItemId(null);
    }
  };

  const handleRemoveGalleryImage = () => {
    if (galleryPreview) URL.revokeObjectURL(galleryPreview);
    setGalleryFile(null);
    setGalleryPreview(null);
  };

  useEffect(() => {
    return () => {
      if (galleryPreview) URL.revokeObjectURL(galleryPreview);
    };
  }, []);

  useEffect(() => {
    setShowResults(false);
    setWardrobeMatches([]);
    setStoreMatches([]);
  }, [itemSource]);

  useEffect(() => {
    getAllProducts()
      .then((res) => setAllProducts(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const getMatchImage = (match) => {
    if (!match?.item) return null;
    const img = match.item.image;
    if (img) {
      const src = typeof img === "string" ? img : img?.url || img?.uri;
      if (src) return imgSrc(src);
    }
    if (match.item.source === "wardrobe") {
      const wItem = wardrobeItems.find((wi) => wi._id === match.item.id || wi.id === match.item.id);
      if (wItem?.image) return imgSrc(wItem.image);
    }
    if (match.item.source === "store") {
      const productId = match.item.id?.replace("store_", "");
      const product = allProducts.find((p) => p._id === productId || p.id === productId);
      if (product) {
        const raw = product.images || product.image;
        const first = Array.isArray(raw) ? raw[0] : raw;
        const src = typeof first === "string" ? first : first?.url || first?.uri;
        if (src) return imgSrc(src);
      }
    }
    return null;
  };

  const handleFindMatches = async () => {
    setIsLoading(true);
    setShowResults(false);
    setWardrobeMatches([]);
    setStoreMatches([]);

    try {
      const processMatches = (raw) => {
        const list = raw?.matches || raw?.data?.matches || (Array.isArray(raw) ? raw : []);
        console.log("Matches list:", list);
        console.log("Total matches:", list.length);
        console.log("Wardrobe matches:", list.filter((m) => m.item?.source === "wardrobe").length);
        console.log("Store matches:", list.filter((m) => m.item?.source === "store").length);
        console.log("Sources:", list.map((m) => m.item?.source));
        setWardrobeMatches(list.filter((m) => m.item?.source === "wardrobe"));
        setStoreMatches(list.filter((m) => m.item?.source === "store"));
      };

      if (itemSource === "wardrobe" && selectedItemId) {
        const res = await getWardrobeMatches(selectedItemId);
        console.log("Wardrobe match response:", res);
        processMatches(res);
      } else if (itemSource === "gallery" && galleryFile) {
        const formData = new FormData();
        formData.append("image", galleryFile, galleryFile.name);
        const analysisRes = await analyzeImage(formData);
        console.log("Analysis response:", analysisRes);
        const analysisId = analysisRes?.analysis_id || analysisRes?.id || analysisRes?.data?.analysis_id;
        console.log("Analysis ID:", analysisId);
        if (analysisId) {
          const matchRes = await getMatchesByAnalysis(analysisId);
          console.log("Gallery match response:", matchRes);
          processMatches(matchRes);
        }
      }
    } catch (err) {
      console.error("Match error:", err);
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  const handleReset = () => {
    if (galleryPreview) URL.revokeObjectURL(galleryPreview);
    setItemSource(null);
    setSelectedItemId(null);
    setGalleryFile(null);
    setGalleryPreview(null);
    setIsLoading(false);
    setShowResults(false);
    setWardrobeMatches([]);
    setStoreMatches([]);
    setAllProducts([]);
  };

  const handleBack = () => {
    setItemSource(null);
    setSelectedItemId(null);
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
            <span style={{ color: "var(--Primary-Text-color)" }}>Redolapy </span>
            <span
              style={{
                background: "linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("matching.title")}
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
            {t("matching.heroDesc")}
          </p>
        </section>

        {/* Step Indicator */}
        <section className="mt-8 sm:mt-10">
          <StepIndicator
            currentStep={currentStep}
            steps={steps}
          />
        </section>

        {/* Source Selection */}
          <section className="mt-12 sm:mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-6xl mx-auto">
              <div
                onClick={() => setItemSource(itemSource === "wardrobe" ? null : "wardrobe")}
                className={`relative p-6 rounded-2xl cursor-pointer flex items-center justify-between transition-all outline-none w-full h-full ${
                  itemSource === "wardrobe"
                    ? "bg-[#E6F6FFCC] border-2 border-[#4FC3FF]"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-bold text-lg">{t("matching.wardrobe")}</h3>
                    <p className="text-xs text-gray-500 max-w-[180px] mt-1">
                      {t("matching.wardrobeDesc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4 mr-6">
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-blue-200">
                      <Shirt className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className={`absolute top-4 ${isArabic ? "left-4" : "right-4"}`}>
                  {itemSource === "wardrobe" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#4FC3FF" stroke="#4FC3FF" strokeWidth="2" />
                      <path d="M8 12l3 3 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-800 fill-white" />
                  )}
                </div>
              </div>

              <div
                onClick={() => setItemSource(itemSource === "gallery" ? null : "gallery")}
                className={`relative p-6 rounded-2xl cursor-pointer flex items-center justify-between transition-all outline-none w-full h-full ${
                  itemSource === "gallery"
                    ? "bg-[#E6F6FFCC] border-2 border-[#4FC3FF]"
                    : "bg-white border border-gray-100 shadow-sm"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div>
                    <h3 className="font-bold text-lg">{t("matching.gallery")}</h3>
                    <p className="text-xs text-gray-500 max-w-[180px] mt-1">
                      {t("matching.galleryDesc")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4 mr-6">
                    <div className="w-24 h-24 bg-blue-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-blue-200">
                      <Grid3x3 className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className={`absolute top-4 ${isArabic ? "left-4" : "right-4"}`}>
                  {itemSource === "gallery" ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#4FC3FF" stroke="#4FC3FF" strokeWidth="2" />
                      <path d="M8 12l3 3 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-800 fill-white" />
                  )}
                </div>
              </div>
            </div>
          </section>

        {/* Wardrobe Content */}
        {itemSource === "wardrobe" && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
            {!user ? (
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <LogIn className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  {t("matching.signInToView")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  <span
                    onClick={() => navigate("/auth")}
                    className="text-blue-500 hover:underline cursor-pointer"
                  >
                    {t("matching.signIn")}
                  </span>{" "}
                  {t("matching.toAccessItems")}
                </p>
              </div>
            ) : wardrobeLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
              </div>
            ) : wardrobeItems.length === 0 ? (
              <div className="bg-gray-100 rounded-xl p-8 text-center">
                <Shirt className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">
                  {t("matching.wardrobeEmpty")}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {t("matching.addItemsToStart")}
                </p>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between mb-5"
                  style={{ marginTop: "30px" }}
                >
                  <h3
                    style={{
                      color: "#1a202c",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                    }}
                  >
                    {t("matching.selectItem")}
                  </h3>
                </div>
                <div
                  className="flex gap-[15px] flex-wrap justify-center sm:justify-start"
                >
                  {wardrobeItems.map((item) => (
                    <WardrobeItem
                      key={item._id}
                      src={imgSrc(item.image)}
                      alt={item.name || t("matching.clothingItem")}
                      selected={selectedItemId === item._id}
                      disabled={!!selectedItemId && selectedItemId !== item._id}
                      onClick={() =>
                        setSelectedItemId(
                          selectedItemId === item._id ? null : item._id
                        )
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          </section>
        )}

        {/* Gallery Content */}
        {itemSource === "gallery" && (
          <section className="mt-12 sm:mt-16">
            <div className="max-w-6xl mx-auto">
            {!galleryFile && (
              <div className="mb-6">
                <UploadArea
                  onFilesSelected={handleGalleryFileSelected}
                  maxFiles={1}
                />
              </div>
            )}
            {galleryFile && galleryPreview && (
              <div className="flex justify-center">
                <div
                  className="relative w-44 sm:w-52 rounded-2xl p-3 sm:p-4"
                  style={{ backgroundColor: "#E9EDFF" }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-white">
                    <img
                      src={galleryPreview}
                      alt="Uploaded item"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveGalleryImage}
                      className={`absolute ${isArabic ? "left-2" : "right-2"} top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div
                    className={`absolute ${isArabic ? "right-5 sm:right-6" : "left-5 sm:left-6"} bottom-5 sm:bottom-6 inline-flex items-center rounded-full px-2 py-1`}
                    style={{
                      backgroundColor: "#FAF8FF",
                      color: "var(--Primary-Text-color)",
                      fontWeight: "var(--Semi-Bold)",
                      fontSize: "12px",
                      lineHeight: "14px",
                    }}
                  >
                    {t("matching.yourItem")}
                  </div>
                </div>
              </div>
            )}
          </div>
          </section>
        )}

        {/* Selected Items Status */}
        <section className="mt-12 sm:mt-16">
          <div className="max-w-6xl mx-auto">
            <div
              className="rounded-[15px] p-5 flex items-center gap-4"
              style={{ backgroundColor: "#edf2ff" }}
            >
              <div className="w-[45px] h-[45px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#dbeafe" }}>
                <Package className="w-5 h-5" style={{ color: "#1e293b" }} />
              </div>
              <div>
                <p className="font-bold" style={{ color: "#1e293b", fontSize: "0.95rem" }}>
                  {selectedTitle}
                </p>
                <p style={{ color: "#64748b", fontSize: "0.85rem" }}>
                  {selectedSubtitle}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Find Matches Button */}
        {!isLoading && (
          <section className="mt-12 sm:mt-16">
            <div className="flex justify-center">
              <button
                onClick={handleFindMatches}
                disabled={!isReady}
                className={`inline-flex items-center gap-2 px-14 py-4 rounded-xl font-bold text-white transition-all shadow-lg w-full max-w-md justify-center ${
                  isArabic ? "flex-row-reverse" : ""
                } ${
                  isReady
                    ? "bg-lime-500 hover:bg-lime-600 hover:scale-105 active:scale-95 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                <Sparkles className="w-5 h-5" />
                {t("matching.findMatches")}
              </button>
            </div>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 mb-4" />
            <p className="text-gray-500 font-medium">
              {t("matching.findingMatches")}
            </p>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <section ref={resultRef} className="mt-12 sm:mt-16 space-y-32">
            <div className="max-w-6xl mx-auto">
            {/* Wardrobe Matches */}
            <div>
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--Primary-Text-color)" }}
              >
                {t("matching.wardrobeMatches")}
              </h2>
              <div className="flex gap-[15px] flex-wrap justify-center sm:justify-start">
                {wardrobeMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">{t("matching.noWardrobeMatches")}</p>
                ) : (
                  wardrobeMatches.map((match, index) => {
                    const imgUrl = getMatchImage(match);
                    const wardrobeId = match.item?._id || match.item?.id;
                    const isFav = wardrobeId ? isFavorite(wardrobeId) : false;
                    const handleFav = (e) => {
                      e.stopPropagation();
                      if (!wardrobeId) return;
                      if (isFav) {
                        removeItem(wardrobeId);
                      } else {
                        addItem(wardrobeId, "WARDROBE");
                      }
                    };
                    return (
                      <div
                        key={match.item?.id || `wm-${index}`}
                        className="shrink-0 transition-all group"
                        style={{
                          width: 130,
                          height: 150,
                          background: "#e2e8f0",
                          borderRadius: 12,
                          padding: 3,
                        }}
                      >
                        <div className="relative w-full h-full bg-white rounded-[9px] flex flex-col items-center justify-center overflow-hidden">
                          <div className={`absolute top-1 ${isArabic ? "left-1" : "right-1"} z-10 bg-lime-500 text-white text-[9px] font-bold px-[6px] py-[2px] rounded-full`}>
                            {match.score}%
                          </div>
                          <button
                            onClick={handleFav}
                            className={`absolute top-1 z-30 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-all cursor-pointer ${isArabic ? "right-1" : "left-1"}`}
                          >
                            <Heart
                              size={12}
                              className={isFav ? "fill-accent-pink text-accent-pink" : "text-gray-500"}
                            />
                          </button>
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={match.item?.name}
                              className="w-[70%] h-auto object-contain"
                            />
                          ) : (
                            <Shirt className="w-[40%] h-auto text-gray-300" />
                          )}
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-[9px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
                            <div
                              className="pointer-events-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                const itemId = match.item?._id || match.item?.id;
                                if (itemId) navigate("/wardrobe/edit/" + itemId);
                              }}
                            >
                              <ArrowRight size={22} className={`text-white ${isArabic ? "rotate-180" : ""}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Store Matches */}
            <div className="mt-16">
              <h2
                className="text-2xl font-bold mb-6"
                style={{ color: "var(--Primary-Text-color)" }}
              >
                {t("matching.storeMatches")}
              </h2>
              <div className="flex gap-[15px] flex-wrap justify-center sm:justify-start">
                {storeMatches.length === 0 ? (
                  <p className="text-gray-400 text-sm py-4">{t("matching.noStoreMatches")}</p>
                ) : (
                  storeMatches.map((match, index) => {
                    const imgUrl = getMatchImage(match);
                    const productId = match.item?.id?.replace("store_", "");
                    const isFav = productId ? isFavorite(productId) : false;
                    const handleFav = (e) => {
                      e.stopPropagation();
                      if (!productId) return;
                      if (isFav) {
                        removeItem(productId);
                      } else {
                        addItem(productId, "PRODUCT");
                      }
                    };
                    const product = allProducts.find((p) => p._id === productId || p.id === productId);
                    return (
                      <div
                        key={match.item?.id || `sm-${index}`}
                        className="shrink-0 transition-all group"
                        style={{
                          width: 130,
                          height: 150,
                          background: "#e2e8f0",
                          borderRadius: 12,
                          padding: 3,
                        }}
                      >
                        <div className="relative w-full h-full bg-white rounded-[9px] flex flex-col items-center justify-center overflow-hidden">
                          <div className={`absolute top-1 ${isArabic ? "left-1" : "right-1"} z-10 bg-lime-500 text-white text-[9px] font-bold px-[6px] py-[2px] rounded-full`}>
                            {match.score}%
                          </div>
                          <button
                            onClick={handleFav}
                            className={`absolute top-1 z-30 p-1 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-all cursor-pointer ${isArabic ? "right-1" : "left-1"}`}
                          >
                            <Heart
                              size={12}
                              className={isFav ? "fill-accent-pink text-accent-pink" : "text-gray-500"}
                            />
                          </button>
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={match.item?.name}
                              className="w-[70%] h-auto object-contain"
                            />
                          ) : (
                            <Shirt className="w-[40%] h-auto text-gray-300" />
                          )}
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] rounded-[9px] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
                            <div
                              className="pointer-events-auto"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (product?.purchase_url) window.open(product.purchase_url, '_blank');
                              }}
                            >
                              <ArrowRight size={22} className={`text-white ${isArabic ? "rotate-180" : ""}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Try Again */}
            <div className="flex justify-center pb-10 mt-16">
              <button
                onClick={handleReset}
                className={`inline-flex items-center justify-center gap-2 w-full max-w-md py-4 rounded-xl font-bold text-white bg-lime-500 hover:bg-lime-600 hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer ${isArabic ? "flex-row-reverse" : ""}`}
              >
                <Sparkles className="w-5 h-5" />
                {t("matching.tryAgain")}
              </button>
            </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
