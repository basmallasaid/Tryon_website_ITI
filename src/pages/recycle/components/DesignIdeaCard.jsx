import React from "react";
import { Check } from "lucide-react";

const DesignIdeaCard = ({ idea, index, selected, onSelect, disabled }) => {
  const isSelected = selected === idea.id;

  const buildDashedGradientSvg = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="dg" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FF8A3D"/>
          <stop offset="50%" stop-color="#40B9FF"/>
          <stop offset="100%" stop-color="#8ED321"/>
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="98" height="98"
        fill="none"
        stroke="url(#dg)"
        stroke-width="2"
        stroke-dasharray="8 5"
        rx="4"
        ry="4"
        vector-effect="non-scaling-stroke"/>
    </svg>`;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  };

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(idea.id)}
      disabled={disabled}
      className={`group relative w-full rounded-2xl bg-white p-6 sm:p-8 text-left transition-all duration-300 ${
        isSelected
          ? "shadow-lg scale-[1.01]"
          : "hover:-translate-y-1 hover:shadow-md"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={
        isSelected
          ? {
              border: "2px solid transparent",
              backgroundImage: buildDashedGradientSvg(),
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              backgroundColor: "white",
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }
          : {
              border: "1px solid var(--Border-Strong)",
            }
      }
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs"
          style={{
            backgroundColor: "#D5D9DE",
            color: "#3E4850",
            fontWeight: "var(--Bold)",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        {isSelected && (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full text-white"
            style={{ backgroundColor: "var(--Secondary-Brand-color)" }}
          >
            <Check className="h-4 w-4" strokeWidth={3} />
          </div>
        )}
      </div>

      <h3
        className="mt-6 sm:mt-8 text-xl sm:text-2xl"
        style={{
          color: "var(--Primary-Text-color)",
          fontWeight: "var(--Bold)",
          lineHeight: "1.4",
        }}
      >
        {idea.title}
      </h3>

      <p
        className="mt-2 line-clamp-3 text-sm"
        style={{ color: "var(--Disabled-Text-color)" }}
      >
        {idea.design_description}
      </p>

      <div
        className="mt-4 text-base"
        style={{
          color: isSelected
            ? "var(--Primary-Brand-color)"
            : "var(--Disabled-Text-color)",
          fontWeight: "var(--Bold)",
        }}
      >
        See more
      </div>
    </button>
  );
};

export default DesignIdeaCard;
