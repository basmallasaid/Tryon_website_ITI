import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import AIExamplesSection from './components/AIExamplesSection';
import HowItWorksSection from './components/HowItWorksSection';

export default function AboutRecycle() {
  return (
    <div className="bg-bg-primary">
      <HeroSection />
      <BenefitsSection />
      <AIExamplesSection />
      <HowItWorksSection />
    </div>
  );
}
