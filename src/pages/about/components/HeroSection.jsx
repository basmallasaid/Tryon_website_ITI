import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Button';

export default function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="sm:max-w-md w-full">
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-text-primary leading-tight mb-6">
                {t('aboutPage.heroTitle1')}
                <br />
                <span className="bg-gradient-to-r from-[#40B9FF] to-[#8ED321] bg-clip-text text-transparent">
                  {t('aboutPage.heroTitle2')}
                </span>
              </h1>

              <p className="font-semibold text-text-disabled leading-relaxed mb-10">
                {t('aboutPage.heroDesc')}
              </p>

              <div className="flex flex-wrap gap-4 items-center w-full">
                <Button
                  variant="styling"
                  className="max-[640px]:!w-full sm:!flex-1 !h-14 !text-lg sm:!h-16 sm:!text-xl"
                  onClick={() => navigate('/tryOn')}
                >
                  {t('aboutPage.getStarted')}
                </Button>
              </div>
            </div>

            <div className="w-full max-w-[586px] mx-auto lg:ml-auto lg:mr-0">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="/2.png"
                  alt="About Redolapy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
