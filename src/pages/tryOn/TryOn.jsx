import { useEffect, useRef, useState } from "react";
import { Sparkles, Upload, WandSparkles, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import StepIndicator from "../recycle/components/StepIndicator";
import UploadArea from "../recycle/components/UploadArea";
import {
  virtualTryOnApi,
  virtualTryOnOutfitApi,
} from "../../api/tryOnApi";

const MAX_FILES = 3;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const buildPreviews = async (files) => {
  const results = await Promise.all(
    Array.from(files).map(async (file) => ({
      file,
      preview: await readFileAsDataUrl(file),
    }))
  );
  return results;
};

export default function TryOn() {
  const { t } = useTranslation();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [apiError, setApiError] = useState("");

  const resultRef = useRef(null);

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
    if (generatedImageUrl && resultRef.current) {
      setTimeout(() => {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, [generatedImageUrl]);

  const currentStep = generatedImageUrl ? 3 : uploadedImages.length > 0 ? 2 : 1;

  const steps = [
    { id: 1, title: t("tryOn.step1Title"), subtitle: t("tryOn.step1Subtitle") },
    { id: 2, title: t("tryOn.step2Title"), subtitle: t("tryOn.step2Subtitle") },
    { id: 3, title: t("tryOn.step3Title"), subtitle: t("tryOn.step3Subtitle") },
  ];

  const handleFilesSelected = async (files) => {
    setApiError("");
    const previews = await buildPreviews(files);
    setUploadedImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    setApiError("");
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
    if (uploadedImages.length <= 1) {
      setGeneratedImageUrl(null);
    }
  };

  const handleTryOn = async () => {
    if (uploadedImages.length === 0) return;
    setApiError("");
    setProcessing(true);
    setGeneratedImageUrl(null);
    try {
      const formData = new FormData();
      const [first, second, third] = uploadedImages;

      formData.append("personImage", first.file);

      if (uploadedImages.length === 3) {
        formData.append("topImage", second.file);
        formData.append("bottomImage", third.file);
        const res = await virtualTryOnOutfitApi(formData);
        setGeneratedImageUrl(res.data?.image_url || res.data?.result?.image_url);
      } else {
        formData.append("garmentImage", second.file);
        const res = await virtualTryOnApi(formData);
        setGeneratedImageUrl(res.data?.image_url || res.data?.result?.image_url);
      }
    } catch (err) {
      setApiError(
        err.response?.data?.error ||
        err.message ||
        t("tryOn.analysisFailed")
      );
    } finally {
      setProcessing(false);
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

        <section className="mt-8 sm:mt-10">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </section>

        <section className="mt-12 sm:mt-16">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-[15px]">
              <Upload
                className="h-6 w-6 sm:h-7 sm:w-7"
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
                  {t("tryOn.uploadGarments")}
                </h2>
                <p
                  className="text-sm sm:text-base"
                  style={{
                    color: "var(--Primary-Text-color)",
                    fontWeight: 400,
                    lineHeight: "18px",
                  }}
                >
                  {t("tryOn.uploadSupport")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 max-w-6xl mx-auto items-start">
            {uploadedImages.length < MAX_FILES && (
              <UploadArea
                onFilesSelected={handleFilesSelected}
                disabled={processing}
                maxFiles={MAX_FILES}
              />
            )}

            {uploadedImages.length > 0 && (
              <div
                className="rounded-2xl p-4"
                style={{ backgroundColor: "#E9EDFF" }}
              >
                <h4
                  className="text-xs tracking-wider mb-4"
                  style={{ color: "var(--Disabled-Text-color)" }}
                >
                  {t("tryOn.currentSelection")}
                </h4>
                <div className="flex flex-col gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl p-3"
                      style={{ backgroundColor: "#FAF8FF" }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white">
                        <img
                          src={img.preview}
                          alt={`${t("tryOn.piece")} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <strong
                          className="block text-sm truncate"
                          style={{
                            color: "var(--Primary-Text-color)",
                            fontWeight: "var(--Semi-Bold)",
                          }}
                        >
                          {t("tryOn.piece")} {idx + 1}
                        </strong>
                        <span
                          className="text-xs"
                          style={{ color: "var(--Disabled-Text-color)" }}
                        >
                          {img.file.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md transition-all duration-200 hover:bg-red-500 hover:text-white hover:scale-110 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {apiError && (
            <div className="mt-4 max-w-6xl mx-auto rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {apiError}
            </div>
          )}
        </section>

        {uploadedImages.length > 0 && !generatedImageUrl && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleTryOn}
              disabled={processing}
              className={`inline-flex items-center gap-3 sm:gap-6 rounded-lg px-8 sm:px-16 py-4 text-lg sm:text-2xl text-white transition-all duration-300 ${
                processing
                  ? "cursor-not-allowed"
                  : "hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              }`}
              style={{
                backgroundColor: processing
                  ? "var(--Border-Strong)"
                  : "var(--Secondary-Brand-color)",
                fontWeight: "var(--Bold)",
                minWidth: "320px",
                maxWidth: "480px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {t("tryOn.processing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  {t("tryOn.tryOn")}
                </>
              )}
            </button>
          </div>
        )}

        {(generatedImageUrl || processing) && (
          <section ref={resultRef} className="mt-14 sm:mt-20">
            <div className="flex items-center gap-3 sm:gap-4 max-w-6xl mx-auto mb-6 sm:mb-8 px-1">
              <WandSparkles
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
                {t("tryOn.yourResult")}
              </h2>
            </div>

            <div
              className="max-w-6xl mx-auto rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "var(--Border-Disabled)",
                minHeight: "400px",
                padding: generatedImageUrl ? "0" : "40px",
              }}
            >
              {processing ? (
                <div
                  className="flex items-center gap-3 text-sm"
                  style={{ color: "var(--Disabled-Text-color)" }}
                >
                  <div
                    className="h-5 w-5 animate-spin rounded-full border-2"
                    style={{
                      borderColor: "var(--Border-Strong)",
                      borderTopColor: "var(--Secondary-Brand-color)",
                    }}
                  />
                  {t("tryOn.generatingResult")}
                </div>
              ) : (
                <img
                  src={generatedImageUrl}
                  alt="Try-on result"
                  className="w-full h-full rounded-2xl shadow-lg"
                  style={{ maxHeight: "600px", objectFit: "contain" }}
                />
              )}
            </div>
          </section>
        )}

        {/* Retry button when result exists */}
        {generatedImageUrl && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleTryOn}
              disabled={processing}
              className={`inline-flex items-center gap-3 sm:gap-6 rounded-lg px-8 sm:px-16 py-4 text-lg sm:text-2xl text-white transition-all duration-300 ${
                processing
                  ? "cursor-not-allowed"
                  : "hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              }`}
              style={{
                backgroundColor: processing
                  ? "var(--Border-Strong)"
                  : "var(--Secondary-Brand-color)",
                fontWeight: "var(--Bold)",
                minWidth: "320px",
                maxWidth: "480px",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  {t("tryOn.processing")}
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
                  {t("tryOn.tryAgain")}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
