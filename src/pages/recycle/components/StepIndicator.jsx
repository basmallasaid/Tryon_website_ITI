import React from "react";

const STEPS = [
  { id: 1, title: "Upload", subtitle: "Upload 1-2 garment photos" },
  { id: 2, title: "Choose Idea", subtitle: "Pick your favorite design" },
  { id: 3, title: "Generate", subtitle: "Visualize your upcycled piece" },
];

const StepIndicator = ({ currentStep = 1 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
      {STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isInactive = step.id > currentStep;

        const borderColor = isActive || isCompleted
          ? "var(--Secondary-Brand-color)"
          : "var(--Border-Disabled)";

        const borderWidth = isActive || isCompleted ? "2px" : "1px";

        const circleBg = isActive || isCompleted
          ? "var(--Lime-Brand-color)"
          : "var(--Disabled-Text-color)";

        const numberColor = isActive || isCompleted
          ? "#FFFFFF"
          : "#FFFFFF";

        return (
          <div
            key={step.id}
            className="flex items-center gap-4 sm:gap-5 rounded-3xl bg-transparent px-6 sm:px-8 py-4 sm:py-5 transition-all duration-500"
            style={{
              borderColor,
              borderWidth,
              borderStyle: "solid",
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-white shadow-sm"
              style={{
                backgroundColor: circleBg,
                color: numberColor,
                fontWeight: "var(--Bold)",
              }}
            >
              {step.id}
            </div>
            <div className="min-w-0 flex-1">
              <div
                className="text-base"
                style={{
                  color: isInactive
                    ? "var(--Disabled-Text-color)"
                    : "var(--Primary-Text-color)",
                  fontWeight: "var(--Bold)",
                }}
              >
                {step.title}
              </div>
              <div
                className="text-sm mt-1"
                style={{
                  color: "var(--Primary-Text-color)",
                  opacity: isInactive ? 0.6 : 0.85,
                }}
              >
                {step.subtitle}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;
