import HeroSection from './components/HeroSection';
import TryOnMattersSection from './components/TryOnMattersSection';
import HowItWorksSection from './components/HowItWorksSection';

export default function AboutTryon() {
  return (
    <div className="bg-bg-primary">
      <HeroSection />
      <TryOnMattersSection />
      <HowItWorksSection />
    </div>
  );
}
