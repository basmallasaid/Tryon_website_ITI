import React from "react";
import { useTranslation } from "react-i18next";

const StepIndicator = ({ currentStep = 1, steps: customSteps }) => {
  const { t } = useTranslation();
  const STEPS = customSteps || [
    { id: 1, title: t("recycle.step1Title"), subtitle: t("recycle.step1Subtitle") },
    { id: 2, title: t("recycle.step2Title"), subtitle: t("recycle.step2Subtitle") },
    { id: 3, title: t("recycle.step3Title"), subtitle: t("recycle.step3Subtitle") },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
      {STEPS.map((step) => {
        const isActive = step.id === currentStep;
        const isCompleted = step.id < currentStep;
        const isInactive = step.id > currentStep;

        const borderWidth = isActive ? "3px" : isCompleted ? "2px" : "1px";

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
            style={
              isActive
                ? {
                    border: `${borderWidth} solid transparent`,
                    backgroundImage: `linear-gradient(var(--primary-bgc, #F5F6F7), var(--primary-bgc, #F5F6F7)), linear-gradient(90deg, #FF8A3D 0%, #40B9FF 50%, #8ED321 100%)`,
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                  }
                : {
                    borderColor: isCompleted
                      ? "var(--Secondary-Brand-color)"
                      : "var(--Border-Disabled)",
                    borderWidth,
                    borderStyle: "solid",
                  }
            }
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base text-white shadow-sm"
              style={{
                backgroundColor: circleBg,
                color: numberColor,
                fontWeight: "var(--Bold)",
                userSelect: "none",
                cursor: "default",
              }}
            >
              {step.id}
            </div>
            <div className="min-w-0 flex-1" style={{ userSelect: "none", cursor: "default" }}>
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
