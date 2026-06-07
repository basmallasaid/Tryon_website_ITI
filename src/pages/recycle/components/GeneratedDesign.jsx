import React from "react";
import { Check, Download, Share2, Sparkles } from "lucide-react";

const TAILORING_SUGGESTIONS = [
  "Use a blind stitch for the waist transition to keep the silhouette clean.",
  "Repurpose the leftover ivory silk for a matching neck scarf or hair accessory.",
];

const GeneratedDesign = ({ idea, imageUrl, loading }) => {
  if (loading) {
    return (
      <section className="max-w-6xl mx-auto mt-16 sm:mt-20">
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <Sparkles
            className="h-7 w-7 sm:h-8 sm:w-8"
            style={{ color: "var(--Primary-Brand-color)" }}
          />
          <h2
            className="text-2xl sm:text-3xl md:text-4xl"
            style={{
              color: "var(--Secondary-Text-color)",
              fontWeight: "var(--Bold)",
              lineHeight: "1.05",
            }}
          >
            Your Generated Design
          </h2>
        </div>
        <div
          className="rounded-2xl bg-white p-6 sm:p-8"
          style={{ border: "1px solid var(--Border-Strong)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div
                    className="h-12 w-12 animate-spin rounded-full border-4"
                    style={{
                      borderColor: "var(--Border-Strong)",
                      borderTopColor: "var(--Secondary-Brand-color)",
                    }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--Disabled-Text-color)" }}
                  >
                    Generating your design...
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div
                className="h-9 w-3/4 animate-pulse rounded-lg"
                style={{ backgroundColor: "var(--Border-Strong)" }}
              />
              <div className="space-y-2">
                <div
                  className="h-4 w-full animate-pulse rounded"
                  style={{ backgroundColor: "#E5E7EB" }}
                />
                <div
                  className="h-4 w-5/6 animate-pulse rounded"
                  style={{ backgroundColor: "#E5E7EB" }}
                />
                <div
                  className="h-4 w-4/6 animate-pulse rounded"
                  style={{ backgroundColor: "#E5E7EB" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!idea || !imageUrl) return null;

  return (
    <section className="max-w-6xl mx-auto mt-16 sm:mt-20">
      <div className="flex items-center gap-3 sm:gap-4 mb-6">
        <Sparkles
          className="h-7 w-7 sm:h-8 sm:w-8"
          style={{ color: "var(--Primary-Brand-color)" }}
        />
        <h2
          className="text-2xl sm:text-3xl md:text-4xl"
          style={{
            color: "var(--Secondary-Text-color)",
            fontWeight: "var(--Bold)",
            lineHeight: "1.05",
          }}
        >
          Your Generated Design
        </h2>
      </div>

      <div
        className="rounded-2xl bg-white p-6 sm:p-8"
        style={{ border: "1px solid var(--Border-Strong)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-900 group">
            <img
              src={imageUrl}
              alt={idea.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="flex flex-col">
            <h3
              className="text-2xl sm:text-3xl md:text-4xl"
              style={{
                color: "var(--Primary-Text-color)",
                fontWeight: "var(--Bold)",
                lineHeight: "1.05",
              }}
            >
              {idea.title}
            </h3>
            <p
              className="mt-4 text-sm sm:text-base"
              style={{
                color: "var(--Disabled-Text-color)",
                lineHeight: "1.5",
              }}
            >
              {idea.design_description}
            </p>

            <div className="mt-6">
              <div
                className="text-sm"
                style={{
                  color: "var(--Primary-Text-color)",
                  fontWeight: "var(--Bold)",
                }}
              >
                Tailoring Suggestions:
              </div>
              <ul className="mt-3 space-y-3">
                {TAILORING_SUGGESTIONS.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "var(--Disabled-Text-color)" }}
                  >
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "rgba(142, 211, 33, 0.15)",
                      }}
                    >
                      <Check
                        className="h-3 w-3"
                        style={{ color: "var(--Secondary-Brand-color)" }}
                        strokeWidth={3}
                      />
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imageUrl;
                  link.download = `${idea.title || "design"}.png`;
                  link.target = "_blank";
                  link.click();
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 text-sm sm:text-base text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
                style={{
                  backgroundColor: "var(--Secondary-Brand-color)",
                  fontWeight: "var(--Bold)",
                  flex: "1 1 auto",
                  minWidth: "160px",
                }}
              >
                <Download className="h-4 w-4" />
                Save Specs
              </button>
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: idea.title,
                        text: idea.design_description,
                        url: imageUrl,
                      })
                      .catch(() => {});
                  } else if (navigator.clipboard) {
                    navigator.clipboard
                      .writeText(imageUrl)
                      .then(() => alert("Link copied to clipboard!"))
                      .catch(() => {});
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-5 sm:px-6 py-3 text-sm sm:text-base bg-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                style={{
                  border: "1px solid var(--Border-Strong)",
                  color: "var(--Primary-Text-color)",
                  fontWeight: "var(--Bold)",
                  flex: "1 1 auto",
                  minWidth: "160px",
                }}
              >
                <Share2 className="h-4 w-4" />
                Share Look
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratedDesign;
