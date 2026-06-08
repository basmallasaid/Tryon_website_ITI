import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

const pricingKeys = {
  essential: {
    items: [
      "pricing.essential.items.0",
      "pricing.essential.items.1",
      "pricing.essential.items.2",
    ],
  },
  pro: {
    items: [
      "pricing.pro.items.0",
      "pricing.pro.items.1",
      "pricing.pro.items.2",
      "pricing.pro.items.3",
    ],
  },
};

const Pricing = () => {
  const { t } = useTranslation();

  return (
    <section className="w-full pt-8 pb-16 px-16 max-[1200px]:px-14 max-[1100px]:px-8">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-bold text-[36px] leading-[38px] text-center text-text-primary">
            {t("pricing.title")}
          </h2>
          <p className="font-semibold text-base text-center text-text-secondary">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 max-[1100px]:flex-col">
          {/* Card 1 - Essential */}
          <div className="w-[424px] h-[530px] max-[1100px]:w-full max-[1100px]:h-auto max-[1100px]:gap-8 rounded-[32px] py-16 px-8 shadow-[0px_0px_4px_0px_#00000026] bg-surface-elevated flex flex-col items-center justify-between">
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <h3 className="pb-2 font-bold text-[36px] leading-[38px] text-text-primary">
                  {t("pricing.essential.name")}
                </h3>
                <p className="py-[6px] flex items-center gap-[6px]">
                  <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-[48px] leading-[56px] tracking-[-0.96px] text-secondary-text">
                    {t("pricing.essential.price")}
                  </span>
                  <span className="font-semibold text-base text-secondary-text">
                    {t("pricing.perMonth")}
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {pricingKeys.essential.items.map((key) => (
                  <div key={key} className="flex items-center gap-1">
                    <Check className="w-[17.11px] h-[12.63px] text-text-secondary shrink-0" />
                    <span className="font-semibold text-base text-text-secondary">
                      {t(key)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-[230px] h-[64px] shrink-0 px-2 py-2 rounded-lg border-2 border-lime cursor-pointer hover:scale-105 active:scale-95 transition-transform bg-transparent font-semibold text-xl text-text-primary">
              {t("pricing.essential.button")}
            </button>
          </div>

          {/* Card 2 - Pro Stylist */}
          <div className="relative w-[448px] h-[567px] max-[1100px]:w-full max-[1100px]:h-auto rounded-[32px] overflow-hidden py-8 px-10 flex flex-col items-center gap-10">
            <span
              className="absolute inset-0 p-[5px] rounded-[32px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, var(--color-accent-orange) 0%, var(--color-primary) 51.44%, var(--color-brand-secondary) 100%)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
              }}
            />

            <div className="relative z-10 flex flex-col items-center gap-10 w-full h-full">
              <div className="self-end w-[116px] rounded-full py-1 px-3 bg-accent-orange flex items-center justify-center">
                <span className="font-medium text-sm leading-[117%] text-surface-elevated">
                  {t("pricing.popular")}
                </span>
              </div>

              <div className="flex flex-col items-center justify-between flex-1 w-full max-[1100px]:gap-8">
                <div className="flex flex-col items-center gap-8">
                  <div className="h-[115px] flex flex-col items-center gap-2">
                    <h3 className="pb-2 font-bold text-[36px] leading-[38px] text-text-primary">
                      {t("pricing.pro.name")}
                    </h3>
                    <p className="py-[6px] flex items-center gap-[6px]">
                      <span className="font-bold text-[36px] leading-[38px] text-text-primary">
                        {t("pricing.pro.price")}
                      </span>
                      <span className="font-semibold text-base text-text-primary">
                        {t("pricing.perMonth")}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    {pricingKeys.pro.items.map((key) => (
                      <div key={key} className="flex items-center gap-1">
                        <Check className="w-[17.11px] h-[12.63px] text-text-secondary shrink-0" />
                        <span className="font-semibold text-base text-text-secondary">
                          {t(key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button className="w-[230px] h-16 px-2 py-2 rounded-lg bg-accent-orange cursor-pointer hover:scale-105 active:scale-95 transition-transform font-semibold text-xl text-[#F1F5F9]">
                  {t("pricing.pro.button")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
