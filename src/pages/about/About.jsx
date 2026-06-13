import HeroSection from './components/HeroSection';
import TeamSection from './components/TeamSection';
import Sustainability from '../home/components/Sustainability';
import Mirror from '../home/components/Mirror';

export default function About() {
  return (
    <div className="bg-bg-primary">
      <HeroSection />
      <Sustainability />
      <Mirror />
      <TeamSection />
    </div>
  );
}
