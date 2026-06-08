import React, { useEffect, useMemo, useRef, useState } from "react";
import { Lightbulb, Sparkles } from "lucide-react";

import StepIndicator from "./components/StepIndicator";
import UploadArea from "./components/UploadArea";
import UploadedImageCard from "./components/UploadedImageCard";
import DesignIdeaCard from "./components/DesignIdeaCard";
import SettingsRow from "./components/SettingsRow";
import GeneratedDesign from "./components/GeneratedDesign";
import {
  analyzeRecycleApi,
  generateRecycleIdeaApi,
} from "../../api/recycleApi";

const HangerIcon = ({ className = "", style = {} }) => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <rect width="40" height="40" fill="url(#pattern0_972_1047)" />
    <defs>
      <pattern id="pattern0_972_1047" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlinkHref="#image0_972_1047" transform="scale(0.0078125)" />
      </pattern>
      <image id="image0_972_1047" width="128" height="128" preserveAspectRatio="none" xlinkHref="data:image/png;base64,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" />
    </defs>
  </svg>
);

const MAX_FILES = 2;
const ACCEPTED_TYPES = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".bmp",
  ".tiff",
  ".tif",
  ".heic",
  ".gif",
];

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const buildPreviews = async (files) => {
  const results = await Promise.all(
    files.map(async (file) => ({
      file,
      preview: await readFileAsDataUrl(file),
    }))
  );
  return results;
};

const Recycle = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [model, setModel] = useState("qwen-image-2.0-pro");
  const [aspectRatio, setAspectRatio] = useState("1536*1024");
  const [generating, setGenerating] = useState(false);
  const [generatedIdea, setGeneratedIdea] = useState(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [apiError, setApiError] = useState("");

  const ideasRef = useRef(null);
  const generateRef = useRef(null);
  const resultRef = useRef(null);

  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === selectedIdeaId) || null,
    [ideas, selectedIdeaId]
  );

  useEffect(() => {
    return () => {
      uploadedImages.forEach((img) => {
        if (img.preview && img.preview.startsWith("blob:")) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [uploadedImages]);

  useEffect(() => {
    if (ideas.length > 0 && ideasRef.current) {
      ideasRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [ideas]);

  useEffect(() => {
    if (selectedIdeaId && generateRef.current) {
      generateRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selectedIdeaId]);

  useEffect(() => {
    if ((generating || generatedIdea) && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    }
  }, [generating, generatedIdea]);

  const handleFilesSelected = async (files) => {
    setApiError("");
    const previews = await buildPreviews(files);
    setUploadedImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    setApiError("");
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);
  };

  const handleDiscoverIdeas = async () => {
    if (uploadedImages.length === 0) return;
    setApiError("");
    setAnalyzing(true);
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);
    try {
      const formData = new FormData();
      uploadedImages.forEach((p) => formData.append("images", p.file));
      const res = await analyzeRecycleApi(formData);
      const data = res.data || {};
      setSessionId(data.session_id);
      setIdeas(data.ideas || []);
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        err.message ||
        "Failed to analyze images. Please try again."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId || !selectedIdeaId) return;
    setApiError("");
    setGenerating(true);
    setGeneratedImageUrl(null);
    setGeneratedIdea(selectedIdea);
    try {
      const res = await generateRecycleIdeaApi(
        sessionId,
        selectedIdeaId,
        model
      );
      const data = res.data || {};
      if (data.image_url) {
        setGeneratedImageUrl(data.image_url);
      } else {
        setApiError("No image was returned from the server.");
      }
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        err.message ||
        "Image generation failed. Please try again."
      );
    } finally {
      setGenerating(false);
    }
  };

  const currentStep = generating
    ? 3
    : ideas.length > 0
      ? 2
      : 1;

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
              Up-cycling Design Generator
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
            Upload your pieces · Pick a design · See it come to life
          </p>
        </section>

        {/* Step Indicator */}
        <section className="mt-8 sm:mt-10">
          <StepIndicator currentStep={currentStep} />
        </section>

        {/* Upload Section */}
        <section className="mt-12 sm:mt-16">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-[15px]">
              <HangerIcon
                style={{ color: "var(--Primary-Text-color)" }}
              />
              <div className="flex flex-col items-start gap-4">
                <h2
                  className="text-3xl sm:text-4xl"
                  style={{
                    color: "var(--Primary-Text-color)",
                    fontWeight: "var(--Bold)",
                    lineHeight: "38px",
                  }}
                >
                  Upload Your Garments
                </h2>
                <p
                  className="text-sm sm:text-base"
                  style={{
                    color: "var(--Primary-Text-color)",
                    fontWeight: 400,
                    lineHeight: "18px",
                  }}
                >
                  Support for JPG, PNG, WEBP (max 10MB each)
                </p>
              </div>
            </div>
          </div>

          {uploadedImages.length < MAX_FILES && (
            <UploadArea
              onFilesSelected={handleFilesSelected}
              disabled={analyzing || generating}
              maxFiles={MAX_FILES}
            />
          )}

          {analyzing && (
            <div
              className="mt-4 flex items-center justify-center gap-3 text-sm"
              style={{ color: "var(--Disabled-Text-color)" }}
            >
              <div
                className="h-4 w-4 animate-spin rounded-full border-2"
                style={{
                  borderColor: "var(--Border-Strong)",
                  borderTopColor: "var(--Secondary-Brand-color)",
                }}
              />
              Analyzing your garments...
            </div>
          )}

          {apiError && (
            <div className="mt-4 max-w-6xl mx-auto rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}
        </section>

        {/* Uploaded Images */}
        {uploadedImages.length > 0 && (
          <section className="mt-8 sm:mt-10">
            <div className="flex flex-wrap gap-4 sm:gap-6 max-w-6xl mx-auto">
              {uploadedImages.map((img, idx) => (
                <UploadedImageCard
                  key={idx}
                  image={img}
                  index={idx}
                  onRemove={handleRemoveImage}
                />
              ))}
            </div>

            {/* Discover Design Ideas Button */}
            {ideas.length === 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleDiscoverIdeas}
                  disabled={analyzing}
                  className={`inline-flex items-center gap-3 sm:gap-6 rounded-lg px-8 sm:px-16 py-4 text-lg sm:text-2xl text-white transition-all duration-300 ${analyzing
                      ? "cursor-not-allowed"
                      : "hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                    }`}
                  style={{
                    backgroundColor: analyzing
                      ? "var(--Border-Strong)"
                      : "var(--Secondary-Brand-color)",
                    fontWeight: "var(--Bold)",
                    minWidth: "320px",
                    maxWidth: "480px",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  {analyzing ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                      Discover Design Ideas
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        )}

        {/* Style Ideas Section */}
        {ideas.length > 0 && (
          <section ref={ideasRef} className="mt-14 sm:mt-20">
            <div className="flex items-center justify-between max-w-6xl mx-auto mb-8 sm:mb-14 px-1 gap-4 flex-wrap">
              <div className="inline-flex items-center gap-3 sm:gap-4">
                <Lightbulb
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  style={{ color: "var(--Primary-Brand-color)" }}
                  strokeWidth={1.5}
                />
                <h2
                  className="text-2xl sm:text-3xl md:text-4xl"
                  style={{
                    color: "var(--Secondary-Text-color)",
                    fontWeight: "var(--Bold)",
                    lineHeight: "1.05",
                  }}
                >
                  Choose Your Style Idea
                </h2>
              </div>
              <span
                className="inline-flex items-center rounded-2xl px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-white"
                style={{
                  backgroundColor: "var(--Secondary-Brand-color)",
                }}
              >
                AI Suggested
              </span>
            </div>

            {/* ✅ THE FIX: items-start prevents sibling cards from stretching */}
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
                className={`inline-flex items-center gap-3 sm:gap-6 rounded-lg px-8 sm:px-16 py-4 text-lg sm:text-2xl text-white transition-all duration-300 ${!selectedIdeaId || generating
                    ? "cursor-not-allowed"
                    : "hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
                  }`}
                style={{
                  backgroundColor: !selectedIdeaId || generating
                    ? "var(--Border-Strong)"
                    : "var(--Secondary-Brand-color)",
                  fontWeight: "var(--Bold)",
                  minWidth: "320px",
                  maxWidth: "480px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {generating ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                    Generate Selected Design
                  </>
                )}
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
      </div>
    </div>
  );
};

export default Recycle;