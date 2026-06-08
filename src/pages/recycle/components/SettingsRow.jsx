import React from "react";
import { ChevronDown } from "lucide-react";

const AI_ENGINES = [
  { id: "qwen-image-2.0-pro", label: "Design Maestro" },
  { id: "qwen-image-2.0", label: "Style Starter" },
];

const ASPECT_RATIOS = [
  { id: "1024*1024", label: "1024 x 1024 (1:1)" },
  { id: "1536*1024", label: "1536 x 1024 (3:2)" },
  { id: "1024*1536", label: "1024 x 1536 (2:3)" },
  { id: "1280*720", label: "1280 x 720 (16:9)" },
];

const SettingsRow = ({ model, setModel, aspectRatio, setAspectRatio }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-6xl mx-auto px-1">
      <div>
        <div
          className="text-sm"
          style={{
            color: "var(--Disabled-Text-color)",
            fontWeight: "var(--Semi-Bold)",
          }}
        >
          AI Engine
        </div>
        <div className="mt-3 relative inline-block w-full sm:w-auto">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-transparent py-1 pr-8 text-base outline-none cursor-pointer"
            style={{ color: "var(--Disabled-Text-color)" }}
          >
            {AI_ENGINES.map((engine) => (
              <option key={engine.id} value={engine.id}>
                {engine.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2"
            style={{ color: "var(--Disabled-Text-color)" }}
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div className="sm:text-right">
        <div
          className="text-sm"
          style={{
            color: "var(--Disabled-Text-color)",
            fontWeight: "var(--Semi-Bold)",
          }}
        >
          Aspect Ratio
        </div>
        <div className="mt-3 relative inline-block w-full sm:w-auto">
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full sm:w-auto appearance-none bg-transparent py-1 pl-1 sm:pl-2 pr-8 text-base outline-none cursor-pointer"
            style={{ color: "var(--Disabled-Text-color)" }}
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.id} value={ratio.id}>
                {ratio.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2"
            style={{ color: "var(--Disabled-Text-color)" }}
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsRow;
