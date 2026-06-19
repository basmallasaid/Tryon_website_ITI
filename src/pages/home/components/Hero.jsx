import heroImg from "../../../assets/herosec.png";
import Button from "../../../components/Button";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="w-full bg-bg-secondary px-20 py-20 max-[1200px]:px-14 max-[1000px]:p-8 flex items-center justify-center gap-[40px] max-[1000px]:flex-col">
      <div className="w-[414px] max-[1000px]:w-full flex flex-col gap-6">
        <h1 className="font-bold text-[64px] max-[1000px]:text-4xl max-[600px]:text-3xl leading-[69px] max-[1000px]:leading-tight">
          <span className="text-text-primary">{t("hero.yourPersonal")}</span>{" "}
          <span className="bg-gradient-to-r from-[#4FC3FF] via-[#74D6B6] to-[#ACF445] bg-clip-text text-transparent">
            {t("hero.aiStylist")}
          </span>
        </h1>
        <p className="font-semibold text-base max-[600px]:text-sm leading-[22px] text-text-disabled w-[327px] max-[1000px]:w-full">
          {t("hero.heroDesc")}
        </p>
        <Button variant="styling" className="max-[1000px]:w-full" onClick={() => navigate("/wardrobe")}>
          {t("hero.startStyling")}
        </Button>
      </div>

      <div className="w-[700px] max-[1000px]:w-full">
        <img src={heroImg} alt="Hero" className="w-full h-auto" />
      </div>
    </section>
  );
};

export default Hero;
