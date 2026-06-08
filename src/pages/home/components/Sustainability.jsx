import bin from "../../../assets/bin.svg";
import recycleIcon from "../../../assets/recycle-icon.svg";
import ticketIcon from "../../../assets/ticket-icon.svg";

const Sustainability = () => {
  return (
    <section className="w-full bg-bg-sustainability py-20 px-8 pb-10">
      <div className="flex items-center justify-center gap-[158px] max-[1200px]:gap-12 max-[1100px]:flex-col">
        <img
          src={bin}
          alt=""
          className="w-[478px] h-[440px] max-[1100px]:w-full max-[1100px]:h-auto rounded-[32px] object-cover shrink-0"
        />

        <div className="w-[495px] h-[482px] max-[1100px]:w-full max-[1100px]:h-auto flex flex-col justify-between max-[1100px]:gap-6">
          <div className="flex flex-col gap-6">
            <h2 className="font-bold text-[36px] leading-[38px] text-text-primary">
              Sustainable Wardrobe
            </h2>
            <p className="font-medium text-base leading-[22px] text-text-secondary opacity-[0.84]">
              AELIA is committed to circular fashion. Our platform doesn't just
              help you style your clothes—it helps you manage their entire
              lifecycle. Join our movement to reduce textile waste through smart
              recycling, reselling, and donation programs.
            </p>

            <div className="flex flex-col gap-6 pt-2">
              <div className="flex items-center gap-4">
                <img
                  src={recycleIcon}
                  alt=""
                  className="w-[22.63px] h-[22.6px] shrink-0"
                />
                <div>
                  <h3 className="font-bold text-2xl leading-[38.4px] text-text-primary">
                    Upcycle & Renew
                  </h3>
                  <p className="font-normal text-base text-text-secondary">
                    Mix and match your existing clothes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <img
                  src={ticketIcon}
                  alt=""
                  className="w-[21.73px] h-[21.7px] shrink-0"
                />
                <div>
                  <h3 className="font-bold text-2xl leading-[38.4px] text-text-primary">
                    Virtual Try-On
                  </h3>
                  <p className="font-normal text-base text-text-secondary">
                    Virtual TryOn Recycled pieces to ensure that it is perfectly
                    complement your current wardrobe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between max-[550px]:flex-col max-[1100px]:items-center max-[1100px]:gap-4">
            <a
              href="/about-recycle/"
              className="relative inline-flex items-center justify-center w-[223px] py-6 rounded-[8px] font-semibold text-base text-text-primary transition-transform cursor-pointer hover:scale-[1.02] active:scale-95 overflow-hidden"
            >
              {/* This pseudo-element creates the 4px gradient border mask seamlessly */}
              <span
                className="absolute inset-0 p-[4px] rounded-[8px]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-lime) 0%, var(--color-primary) 51.44%, var(--color-accent-orange) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <span className="relative z-10">Learn about recycling</span>
            </a>

            <a className="relative inline-flex items-center justify-center w-[223px] py-6 rounded-[8px] font-semibold text-base text-text-primary transition-transform cursor-pointer hover:scale-[1.02] active:scale-95 overflow-hidden">
              <span
                className="absolute inset-0 p-[4px] rounded-[8px]"
                style={{
                  background:
                    "linear-gradient(90deg, var(--color-lime) 0%, var(--color-primary) 51.44%, var(--color-accent-orange) 100%)",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
              <span className="relative z-10">Learn about TryOn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sustainability;
