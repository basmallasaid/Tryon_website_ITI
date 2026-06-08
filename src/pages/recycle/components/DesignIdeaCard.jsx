import React, { useState, useId } from "react";
import { Check } from "lucide-react";

const DesignIdeaCard = ({ idea, index, selected, onSelect, disabled }) => {
  const isSelected = selected === idea.id;
  const [expanded, setExpanded] = useState(false);

  const uid = useId().replace(/:/g, "-");
  const gradId = `dg-${uid}`;

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(idea.id)}
      disabled={disabled}
      className={`group relative w-full text-left transition-all duration-300 ${isSelected ? "shadow-lg" : "hover:-translate-y-1 hover:shadow-md"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      style={{
        borderRadius: "16px",
        border: isSelected ? "none" : "1px solid var(--Border-Strong)",
        padding: isSelected ? 0 : undefined,
      }}
    >
      {isSelected && (
        <svg
          className="absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          style={{ borderRadius: "16px", overflow: "visible" }}
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF8A3D" />
              <stop offset="50%" stopColor="#40B9FF" />
              <stop offset="100%" stopColor="#8ED321" />
            </linearGradient>
          </defs>
          <rect
            x="1.25" y="1.25"
            width="calc(100% - 2.5px)" height="calc(100% - 2.5px)"
            fill="none"
            rx="15" ry="15"
            stroke={`url(#${gradId})`}
            strokeWidth="2.5"
            strokeDasharray="8,5"
            strokeLinecap="round"
          />
        </svg>
      )}

      <div
        className="w-full bg-white p-6 sm:p-8 flex flex-col"
        style={{
          borderRadius: isSelected ? "14px" : "16px",
          margin: isSelected ? "2px" : undefined,
          width: isSelected ? "calc(100% - 4px)" : undefined,
          minHeight: "320px",
        }}
      >
        <div className="flex items-center justify-between flex-shrink-0">
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
          className="mt-6 sm:mt-8 text-xl sm:text-2xl flex-shrink-0"
          style={{
            color: "var(--Primary-Text-color)",
            fontWeight: "var(--Bold)",
            lineHeight: "1.4",
          }}
        >
          {idea.title}
        </h3>

        {/* Clean ellipsis truncation via line-clamp-3, full text when expanded */}
        <p
          className={`mt-2 text-sm ${expanded ? "" : "line-clamp-3"}`}
          style={{ color: "var(--Disabled-Text-color)" }}
        >
          {idea.design_description}
        </p>

        <div
          className="mt-4 text-base cursor-pointer flex-shrink-0"
          style={{
            color: isSelected
              ? "var(--Primary-Brand-color)"
              : "var(--Disabled-Text-color)",
            fontWeight: "var(--Bold)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded((prev) => !prev);
          }}
        >
          {expanded ? "See less" : "See more"}
        </div>
      </div>
    </button>
  );
};

export default DesignIdeaCard;