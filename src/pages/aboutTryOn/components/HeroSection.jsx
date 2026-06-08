import Button from '../../../components/Button';
import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="sm:max-w-md w-full">
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-text-primary leading-tight mb-6">
                Style your look with
                <br />
                <span className="bg-gradient-to-r from-[#40B9FF] to-[#8ED321] bg-clip-text text-transparent">
                  Virtual Try-on{' '}
                </span>
              </h1>

              <p className="font-semibold text-text-disabled leading-relaxed mb-10">
                Our intelligent recycling ecosystem ensures no garment ever goes
                to waste. Use our Smart Bins to recycle, track your
                environmental impact in real-time, and give your style a second
                life.
              </p>

              <div className="flex flex-wrap gap-4 items-center w-full">
                <Button
                  variant="styling"
                  className="max-[640px]:!w-full sm:!flex-1 !h-14 !text-lg sm:!h-16 sm:!text-xl"
                  onClick={() => {
                    navigate('/tryOn');
                  }}
                >
                  Try now
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
                    See how it works
                  </span>
                </a>
              </div>
            </div>

            {/* Right: Try-On Image */}
            <div className=" w-full max-w-[586px] mx-auto lg:ml-auto lg:mr-0">
              <div className="rounded-2xl overflow-hidden ">
                <img
                  src="/tryonAboutHero.png"
                  alt="Virtual try-on preview"
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
