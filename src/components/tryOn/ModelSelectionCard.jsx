import { Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ModelSelectionCard({ children, selected, onClick, badge, media }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <div
      onClick={onClick}
      className={`relative p-6 rounded-2xl cursor-pointer flex items-center justify-between transition-all outline-none w-full h-full ${
        selected
          ? "bg-[var(--primary-light)]/60 border-2 border-[var(--primary)]"
          : "bg-surface-elevated border border-[var(--border)] shadow-sm"
      }`}
    >
      <div>
        {children}
        {badge && (
          <span className="bg-[var(--primary)] text-white text-[10px] px-2 py-0.5 rounded-full uppercase font-semibold">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0 ml-4 mr-6">
        {media && (
          typeof media === "string"
            ? <img src={media} alt="" className="w-24 h-24" />
            : media
        )}
      </div>
      <div className={`absolute top-4 ${isArabic ? 'left-4' : 'right-4'}`}>
        {selected ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="var(--primary)" stroke="var(--primary)" strokeWidth="2" />
            <path d="M8 12l3 3 5-5" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <Circle className="w-5 h-5 text-text-primary fill-white" />
        )}
      </div>
    </div>
  );
}
