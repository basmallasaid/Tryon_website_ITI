import React, { useEffect, useMemo, useState } from "react";
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
    height="32"
    viewBox="0 0 40 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M2 32C1.43333 32 0.958333 31.8083 0.575 31.425C0.191667 31.0417 0 30.5667 0 30C0 29.6667 0.0666667 29.3583 0.2 29.075C0.333333 28.7917 0.533333 28.5667 0.8 28.4L18 15.5V12C18 11.4333 18.2 10.9583 18.6 10.575C19 10.1917 19.4833 10 20.05 10C20.8833 10 21.5833 9.7 22.15 9.1C22.7167 8.5 23 7.78333 23 6.95C23 6.11667 22.7083 5.41667 22.125 4.85C21.5417 4.28333 20.8333 4 20 4C19.1667 4 18.4583 4.29167 17.875 4.875C17.2917 5.45833 17 6.16667 17 7H13C13 5.06667 13.6833 3.41667 15.05 2.05C16.4167 0.683333 18.0667 0 20 0C21.9333 0 23.5833 0.675 24.95 2.025C26.3167 3.375 27 5.01667 27 6.95C27 8.51667 26.5417 9.91667 25.625 11.15C24.7083 12.3833 23.5 13.2333 22 13.7V15.5L39.2 28.4C39.4667 28.5667 39.6667 28.7917 39.8 29.075C39.9333 29.3583 40 29.6667 40 30C40 30.5667 39.8083 31.0417 39.425 31.425C39.0417 31.8083 38.5667 32 38 32H2ZM8 28H32L20 19L8 28Z"
      fill="#121826"
    />
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

  const handleFilesSelected = async (files) => {
    setApiError("");
    const previews = await buildPreviews(files);
    setUploadedImages(previews);
    setIdeas([]);
    setSessionId(null);
    setSelectedIdeaId(null);
    setGeneratedIdea(null);
    setGeneratedImageUrl(null);

    setAnalyzing(true);
    try {
      const formData = new FormData();
      previews.forEach((p) => formData.append("images", p.file));
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
      setUploadedImages([]);
    } finally {
      setAnalyzing(false);
    }
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
              color: "var(--Primary-Text-color)",
              fontWeight: "var(--Bold)",
              lineHeight: "1.2",
            }}
          >
            Redolapy Up-cycling Design Generator
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
          </section>
        )}

        {/* Style Ideas Section */}
        {ideas.length > 0 && (
          <section className="mt-14 sm:mt-20">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
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
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={!selectedIdeaId || generating}
                className={`inline-flex items-center gap-3 sm:gap-6 rounded-lg px-8 sm:px-16 py-4 text-lg sm:text-2xl text-white transition-all duration-300 ${
                  !selectedIdeaId || generating
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
          <GeneratedDesign
            idea={generatedIdea}
            imageUrl={generatedImageUrl}
            loading={generating}
          />
        )}
      </div>
    </div>
  );
};

export default Recycle;
