import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

const UploadedImageCard = ({ image, index, onRemove }) => {
  const { t } = useTranslation();
  return (
    <div
      className="relative w-44 sm:w-52 rounded-2xl p-3 sm:p-4 bg-info-bg"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-surface-elevated">
        <img
          src={image.preview}
          alt={`${t("recycle.piece")} ${index + 1}`}
          className="h-full w-full object-cover"
        />
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`${t("recycle.piece")} ${index + 1}`}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-surface-elevated/90 text-text-secondary shadow-md transition-all duration-200 hover:bg-error-text hover:text-white hover:scale-110"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div
        className="absolute left-5 bottom-5 sm:left-6 sm:bottom-6 inline-flex items-center rounded-full px-2 py-1"
        className="bg-info-bg"
        style={{
          color: "var(--Primary-Text-color)",
          fontWeight: "var(--Semi-Bold)",
          fontSize: "12px",
          lineHeight: "14px",
        }}
      >
        {t("recycle.piece")} {index + 1}
      </div>
    </div>
  );
};

export default UploadedImageCard;
