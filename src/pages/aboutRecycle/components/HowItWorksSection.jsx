import StepCard from './StepCard';
import CameraIcon from '../../../icons/CameraIcon';
import SparkleIcon from '../../../icons/SparkleIcon';
import TshirtIcon from '../../../icons/TshirtIcon';
import { useTranslation } from 'react-i18next';

export default function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = [
    {
      number: 1,
      icon: CameraIcon,
      title: t('aboutRecycle.uploadClothing'),
      description: t('aboutRecycle.uploadClothingDesc'),
      iconColor: '#004769',
      parentBg: '#40B9FF',
      badgeBg: '#006492',
    },
    {
      number: 2,
      icon: SparkleIcon,
      title: t('aboutRecycle.aiSuggestsIdeas'),
      description: t('aboutRecycle.aiSuggestsIdeasDesc'),
      iconColor: '#466E00',
      parentBg: '#ACF445',
      badgeBg: '#426900',
    },
    {
      number: 3,
      icon: TshirtIcon,
      title: t('aboutRecycle.transformReuse'),
      description: t('aboutRecycle.transformReuseDesc'),
      iconColor: '#6F3000',
      parentBg: '#FF9451',
      badgeBg: '#9A4600',
    },
  ];

  return (
    <section id="how-it-works" className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            {t('aboutRecycle.howItWorks')}
          </h2>
          <p className="text-text-disabled  max-w-2xl mx-auto leading-relaxed">
            {t('aboutRecycle.threeSimpleSteps')}
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map(step => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
