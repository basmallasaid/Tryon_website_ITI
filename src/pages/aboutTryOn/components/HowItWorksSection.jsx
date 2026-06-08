import CameraIcon from '../../../icons/CameraIcon';
import BodyIcon from '../../../icons/BodyIcon';
import SparkleIcon from '../../../icons/SparkleIcon';

const steps = [
  {
    number: 1,
    icon: CameraIcon,
    title: 'Upload Your Photo',
    description:
      'Take a full-body photo or use your camera to create your digital fitting room avatar.',
    iconColor: '#004769',
    parentBg: '#40B9FF',
    badgeBg: '#006492',
  },
  {
    number: 2,
    icon: BodyIcon,
    title: 'See It on Your Body',
    description:
      'Browse our collection or upload any garment you like. Our AI maps it onto your body.',
    iconColor: '#9A4600',
    parentBg: '#FF9451',
    badgeBg: '#6F3000',
  },
  {
    number: 3,
    icon: SparkleIcon,
    title: 'See It Instantly',
    description:
      'Get a realistic preview in seconds. Move, zoom, and see how it looks from every angle.',
    iconColor: '#466E00',
    parentBg: '#ACF445',
    badgeBg: '#426900',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-6 sm:px-10 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-disabled max-w-2xl mx-auto leading-relaxed">
            Three simple steps to see yourself in any outfit.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {steps.map(step => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="relative mb-8">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  style={{ backgroundColor: step.parentBg }}
                >
                  <step.icon
                    className="w-[25px] h-auto"
                    style={{ color: step.iconColor }}
                  />
                </div>
                <div
                  className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ backgroundColor: step.badgeBg }}
                >
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-text-secondary leading-relaxed max-w-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
