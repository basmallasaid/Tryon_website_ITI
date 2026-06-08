import { useTranslation } from 'react-i18next';
import StarSparkleIcon from '../../../icons/StarSparkleIcon';
import RepeatIcon from '../../../icons/RepeatIcon';
import LightBulbIcon from '../../../icons/LightBulbIcon';

const benefits = [
  {
    icon: StarSparkleIcon,
    titleKey: 'fitAnalysis',
    descKey: 'fitAnalysisDesc',
    bgColor: 'bg-[#9A46001A]',
    iconColor: 'text-[#9A4600]',
  },
  {
    icon: RepeatIcon,
    titleKey: 'perfectFit',
    descKey: 'perfectFitDesc',
    bgColor: 'bg-[#0064921A]',
    iconColor: 'text-[#006492]',
  },
  {
    icon: LightBulbIcon,
    titleKey: 'stylingTip',
    descKey: 'stylingTipDesc',
    bgColor: 'bg-[#4269001A]',
    iconColor: 'text-[#426900]',
  },
];

export default function TryOnMattersSection() {
  const { t } = useTranslation();
  return (
    <section className="px-6 sm:px-10 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            {t('aboutTryon.whyMatters')}
          </h2>
          <p className="text-text-disabled max-w-2xl mx-auto leading-relaxed">
            {t('aboutTryon.whyMattersSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map(benefit => (
            <div
              key={benefit.titleKey}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent transition-all duration-300 hover:shadow-xl"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-full p-2 ${benefit.bgColor} mb-6`}
              >
                <benefit.icon className={`w-5 h-5 ${benefit.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {t(`aboutTryon.${benefit.titleKey}`)}
              </h3>
              <p className="text-text-secondary leading-relaxed">
                {t(`aboutTryon.${benefit.descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
