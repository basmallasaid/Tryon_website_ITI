export default function BenefitCard({ icon: Icon, title, description, bgColor, iconColor }) {
  return (
    <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent transition-all duration-300 hover:shadow-xl">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full p-2 ${bgColor} mb-6`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{description}</p>
    </div>
  );
}
