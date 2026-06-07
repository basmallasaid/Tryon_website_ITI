export default function StepCard({
  number,
  icon: Icon,
  title,
  description,
  iconColor,
  parentBg,
  badgeBg,
}) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="relative mb-8">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          style={{ backgroundColor: parentBg }}
        >
          <Icon className="w-[25px] h-auto" style={{ color: iconColor }} />
        </div>
        <div
          className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ backgroundColor: badgeBg }}
        >
          {number}
        </div>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed max-w-sm">
        {description}
      </p>
    </div>
  );
}
