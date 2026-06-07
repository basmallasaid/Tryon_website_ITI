import BenefitCard from './BenefitCard';
import MoneyIcon from '../../../icons/MoneyIcon';
import RecycleIcon from '../../../icons/RecycleIcon';
import WaterIcon from '../../../icons/WaterIcon';

const benefits = [
  {
    icon: MoneyIcon,
    title: 'Save Money',
    description:
      'Refresh your personal style and get more tangible value from the high-quality clothes you already own.',
    bgColor: 'bg-[#9A46001A]',
    iconColor: 'text-[#9A4600]',
  },
  {
    icon: RecycleIcon,
    title: 'Reduce Waste',
    description:
      'Keep clothing out of landfills and reduce the overall environmental footprint of the fashion industry.',
    bgColor: 'bg-[#4269001A]',
    iconColor: 'text-[#426900]',
  },
  {
    icon: WaterIcon,
    title: 'Save Water',
    description:
      'Upcycling uses significantly less water compared to producing entirely new textile garments.',
    bgColor: 'bg-[#0064921A]',
    iconColor: 'text-[#006492]',
  },
];

export default function BenefitsSection() {
  return (
    <section className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            Why Upcycling Matters
          </h2>
          <p className="text-text-disabled max-w-2xl mx-auto leading-relaxed">
            Small changes today, big impact tomorrow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map(benefit => (
            <BenefitCard key={benefit.title} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}
