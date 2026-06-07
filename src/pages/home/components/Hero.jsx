import heroImg from "../../../assets/hero-img.svg";
import Button from "../../../components/Button";

const Hero = () => {
  return (
    <section className="w-full bg-[#F4F3F5] px-20 py-20 max-[1200px]:px-14 max-[1000px]:p-8 flex items-center justify-center gap-[26px] max-[1000px]:flex-col">
      <div className="w-[414px] max-[1000px]:w-full flex flex-col gap-6">
        <h1 className="font-roboto font-bold text-[64px] max-[1000px]:text-4xl max-[600px]:text-3xl leading-[69px] max-[1000px]:leading-tight">
          <span className="text-text-primary">Your Personal</span>{" "}
          <span className="bg-gradient-to-r from-[#4FC3FF] via-[#74D6B6] to-[#ACF445] bg-clip-text text-transparent">
            AI Stylist.
          </span>
        </h1>
        <p className="font-roboto font-semibold text-base max-[600px]:text-sm leading-[22px] text-[#6B7280] w-[327px] max-[1000px]:w-full">
          Get outfit recommendations, virtual try-ons, and wardrobe insights
          tailored to your style. smart.fast.effortless.
        </p>
        <Button variant="styling" className="max-[1000px]:w-full">
          Start Styling
        </Button>
      </div>

      <div className="w-[700px] max-[1000px]:w-full">
        <img src={heroImg} alt="Hero" className="w-full h-auto" />
      </div>
    </section>
  );
};

export default Hero;
