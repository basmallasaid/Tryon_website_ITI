import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text Content */}
            <div className="max-w-md">
              <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-text-primary leading-tight mb-6">
                Give Your Clothes a
                <br />
                <span className="bg-gradient-to-r from-[#40B9FF]  to-[#8ED321] bg-clip-text text-transparent">
                  Second Life
                </span>
              </h1>

              <p className="font-semibold text-text-disabled leading-relaxed mb-10">
                Our intelligent recycling ecosystem ensures no garment ever goes
                to waste. Use our Smart Bins to recycle, track your
                environmental impact in real-time, and give your style a second
                life.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] text-white font-semibold rounded-lg text-base hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  onClick={() => {
                    navigate('/recycle');
                  }}
                >
                  Start Recycling
                </button>
                <div className="rounded-lg bg-gradient-to-r from-[#FF8A3D] via-[#40B9FF] to-[#8ED321] p-px">
                  <button className="inline-flex items-center gap-2 px-8 py-4 bg-[#F4F3F5] text-brand-secondary font-semibold rounded-lg text-base hover:shadow-lg active:scale-[0.98] transition-all duration-200 w-full">
                    See how it works
                  </button>
                </div>
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
                      Before
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
                      After
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
