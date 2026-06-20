import HeroSection from "./components/HeroSection";
import TeamSection from "./components/TeamSection";
import Sustainability from "../home/components/Sustainability";

export default function About() {
  return (
    <div className="bg-bg-primary">
      <style>{"section { background: var(--background) !important; }"}</style>
      <HeroSection />
      <Sustainability />
      <TeamSection />
    </div>
  );
}
