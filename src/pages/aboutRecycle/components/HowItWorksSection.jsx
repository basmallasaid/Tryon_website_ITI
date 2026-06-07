import StepCard from './StepCard';
import CameraIcon from '../../../icons/CameraIcon';
import SparkleIcon from '../../../icons/SparkleIcon';
import TshirtIcon from '../../../icons/TshirtIcon';

const steps = [
  {
    number: 1,
    icon: CameraIcon,
    title: 'Upload Your Clothing',
    description:
      'Take photos pf items you no longer wear or use and add them to your digital atelier',
    iconColor: '#004769',
    parentBg: '#40B9FF',
    badgeBg: '#006492',
  },
  {
    number: 2,
    icon: SparkleIcon,
    title: 'AI Suggests Ideas',
    description:
      'Our AI analyzes your items and generates creative upcycling ideas tailored to your style.',
    iconColor: '#466E00',
    parentBg: '#ACF445',
    badgeBg: '#426900',
  },
  {
    number: 3,
    icon: TshirtIcon,
    title: 'Transform & Reuse',
    description:
      'Bring your new design to life or connect with creators in our curated marketplace.',
    iconColor: '#6F3000',
    parentBg: '#FF9451',
    badgeBg: '#9A4600',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-disabled  max-w-2xl mx-auto leading-relaxed">
            Three simple steps to transform your clothes and make an impact.
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
