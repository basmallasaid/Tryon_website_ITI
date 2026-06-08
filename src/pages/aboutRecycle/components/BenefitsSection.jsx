import BenefitCard from './BenefitCard';
import MoneyIcon from '../../../icons/MoneyIcon';
import RecycleIcon from '../../../icons/RecycleIcon';
import WaterIcon from '../../../icons/WaterIcon';
import { useTranslation } from 'react-i18next';

export default function BenefitsSection() {
  const { t } = useTranslation();
  const benefits = [
    {
      icon: MoneyIcon,
      title: t('aboutRecycle.saveMoney'),
      description: t('aboutRecycle.saveMoneyDesc'),
      bgColor: 'bg-[#9A46001A]',
      iconColor: 'text-[#9A4600]',
    },
    {
      icon: RecycleIcon,
      title: t('aboutRecycle.reduceWaste'),
      description: t('aboutRecycle.reduceWasteDesc'),
      bgColor: 'bg-[#4269001A]',
      iconColor: 'text-[#426900]',
    },
    {
      icon: WaterIcon,
      title: t('aboutRecycle.saveWater'),
      description: t('aboutRecycle.saveWaterDesc'),
      bgColor: 'bg-[#0064921A]',
      iconColor: 'text-[#006492]',
    },
  ];

  return (
    <section className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            {t('aboutRecycle.whyUpcycling')}
          </h2>
          <p className="text-text-disabled max-w-2xl mx-auto leading-relaxed">
            {t('aboutRecycle.smallChanges')}
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
