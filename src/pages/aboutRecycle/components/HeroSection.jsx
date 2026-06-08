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
            {/* Left: Text Content */}
            <div className="sm:max-w-md w-full">
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-text-primary leading-tight mb-6">
                {t('aboutRecycle.heroTitle1')}
                <br />
                <span className="bg-gradient-to-r from-[#40B9FF]  to-[#8ED321] bg-clip-text text-transparent">
                  {t('aboutRecycle.heroTitle2')}
                </span>
              </h1>

              <p className="font-semibold text-text-disabled leading-relaxed mb-10">
                {t('aboutRecycle.heroDesc')}
              </p>

              <div className="flex flex-wrap gap-4 items-center w-full">
                <Button
                  variant="styling"
                  className="max-[640px]:!w-full sm:!flex-1 !h-14 !text-lg sm:!h-16 sm:!text-xl"
                  onClick={() => {
                    navigate('/recycle');
                  }}
                >
                  {t('aboutRecycle.startRecycling')}
                </Button>
                <a
                  href="#how-it-works"
                  className="relative inline-flex items-center justify-center max-[640px]:w-full sm:flex-1 h-14 sm:h-16 px-6 rounded-[8px] font-semibold text-lg sm:text-xl text-text-primary transition-transform cursor-pointer hover:scale-[1.02] active:scale-95 overflow-hidden"
                >
                  <span
                    className="absolute inset-0 p-[4px] rounded-[8px]"
                    style={{
                      background:
                        'linear-gradient(90deg, var(--color-lime) 0%, var(--color-primary) 51.44%, var(--color-accent-orange) 100%)',
                      WebkitMask:
                        'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    }}
                  />
                  <span className="relative z-10 text-brand-secondary">
                    {t('aboutRecycle.seeHowItWorks')}
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Before/After Showcase */}
            <div className="relative w-full max-w-[586px] mx-auto lg:ml-auto lg:mr-0 lg:h-full">
              <div className="flex rounded-2xl overflow-hidden shadow-lg lg:h-full">
                {/* Before Panel */}
                <div className="relative w-1/2 aspect-[3/4] lg:aspect-auto lg:h-full bg-gray-100">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src="/before.png"
                      alt="Original garment before upcycling"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-0 left-0 w-0 h-0 border-t-[80px] border-r-[80px] border-t-black/70 border-r-transparent">
                    <span
                      className="absolute text-white text-[11px] font-bold uppercase tracking-widest"
                      style={{
                        top: '-60px',
                        left: '10px',
                        transform: 'rotate(-45deg)',
                      }}
                    >
                      {t('aboutRecycle.before')}
                    </span>
                  </div>
                </div>

                {/* After Panel */}
                <div className="relative w-1/2 aspect-[3/4] lg:aspect-auto lg:h-full bg-gray-100">
                  <div className="absolute inset-0 overflow-hidden">
                    <img
                      src="/after.png"
                      alt="Garment after AI upcycling"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-l-[80px] border-t-[#8ed321] border-l-transparent">
                    <span
                      className="absolute text-white text-[11px] font-bold uppercase tracking-widest"
                      style={{
                        top: '-60px',
                        right: '10px',
                        transform: 'rotate(45deg)',
                      }}
                    >
                      {t('aboutRecycle.after')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
