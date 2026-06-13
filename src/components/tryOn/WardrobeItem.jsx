import { useTranslation } from "react-i18next";

export default function WardrobeItem({ src, alt, selected, disabled = false, onClick }) {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const gradientBorder = `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3clinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='0%25'%3e%3cstop offset='0%25' stop-color='%23FF8A3D'/%3e%3cstop offset='50%25' stop-color='%2340B9FF'/%3e%3cstop offset='100%25' stop-color='%238ED321'/%3e%3c%2flinearGradient%3e%3c%2fdefs%3e%3crect width='100%25' height='100%25' fill='none' rx='12' ry='12' stroke='url(%23g)' stroke-width='3' stroke-linecap='round'/%3e%3c%2fsvg%3e")`;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`shrink-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} transition-all`}
      style={{
        width: 130,
        height: 150,
        background: selected ? gradientBorder : "var(--bg-secondary)",
        borderRadius: 12,
        padding: 3,
      }}
    >
      <div className="relative w-full h-full bg-surface-elevated rounded-[9px] flex justify-center items-center">
        <div
          className={`absolute top-2 ${isArabic ? 'left-2' : 'right-2'} w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold leading-none`}
          style={{
            backgroundColor: selected ? "var(--secondary)" : "var(--Disabled-Text-color)",
            color: "white",
          }}
        >
          ✓
        </div>
        <img src={src} alt={alt} className="w-[70%] h-auto object-contain" />
      </div>
    </div>
  );
}
