import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Check, CircleCheck } from "lucide-react";

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
  const navigate = useNavigate();
  const [isMonthly, setIsMonthly] = useState(true);

  return (
    <section className="w-full p-16 max-[1200px]:px-14 max-[1100px]:px-8">
      <div className="flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-4">
          <h2 className="font-roboto font-bold text-[48px] leading-[58px] text-center bg-[linear-gradient(90deg,#40B9FF_2.4%,#8ED321_100%)] bg-clip-text text-transparent">
            {t("pricing.title")}
          </h2>
          <p className="font-roboto font-semibold text-[20px] text-center text-text-secondary">
            {t("pricing.subtitle")}
          </p>
        </div>

        <div className="w-[798px] h-[94px] flex items-center justify-center max-[1100px]:w-full max-[1100px]:px-4">
          <div className="relative flex items-center bg-[#EDEDED] rounded-full w-full h-full">
            <span
              className="absolute rounded-full border border-[var(--border)] bg-surface-elevated shadow-[0px_1px_2px_0px_#0000000D] transition-all duration-300 ease-in-out"
              style={{
                top: "4px",
                bottom: "4px",
                    width: "calc(50% - 6px)",
                    insetInlineStart: isMonthly ? "4px" : "calc(50% + 2px)",
              }}
            />
            <button
              onClick={() => setIsMonthly(true)}
              className="relative z-10 w-1/2 h-full rounded-full font-roboto font-bold text-[24px] leading-[38.4px] transition-colors duration-300 cursor-pointer"
              style={{ color: isMonthly ? "var(--color-text-primary)" : "var(--color-border-disabled)" }}
            >
              {t("pricing.monthly")}
            </button>
            <button
              onClick={() => setIsMonthly(false)}
              className="relative z-10 w-1/2 h-full rounded-full font-roboto font-bold text-[24px] leading-[38.4px] transition-colors duration-300 cursor-pointer"
              style={{ color: !isMonthly ? "var(--color-text-primary)" : "var(--color-border-disabled)" }}
            >
              {t("pricing.yearly")}
            </button>
          </div>
        </div>

        <div className="flex items-stretch justify-center gap-8 max-[1100px]:flex-col">
          {/* Card 1 - Essential */}
          <div className="w-[449px] max-[1100px]:w-full rounded-[32px] py-8 max-[1100px]:py-6 px-10 shadow-[0px_0px_4px_0px_#00000026] bg-surface-elevated flex flex-col gap-8">
            <div className="w-[154px] h-8 rounded-full py-1 px-3 bg-[var(--text-secondary)] flex items-center justify-center self-start">
              <span className="font-roboto font-medium text-[14px] leading-[117%] text-surface-elevated text-center">
                {t("pricing.currentPlan")}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-8">
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
          </div>

          {/* Card 2 - Pro Stylist */}
          <div className="relative w-[449px] max-[1100px]:w-full rounded-[32px] overflow-hidden shrink-0">
            <span
              className="absolute inset-0 p-[4px] rounded-[32px] pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, #FF8A3D 0%, #40B9FF 51.44%, #8ED321 100%)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
              }}
            />

            <div className="relative z-10 w-full h-full flex flex-col gap-8 py-8 max-[1100px]:py-6 px-10">
              <div className="w-[116px] rounded-full py-1 px-3 bg-accent-orange flex items-center justify-center">
                <span className="font-medium text-sm leading-[117%] text-surface-elevated">
                  {t("pricing.popular")}
                </span>
              </div>

              <div className="flex flex-col gap-14 flex-1">
                <div className="flex flex-col gap-6">
                  <h3 className="pb-2 font-bold text-[36px] leading-[38px] text-text-primary">
                    {t("pricing.pro.name")}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {pricingKeys.pro.items.map((key) => (
                      <div key={key} className="flex items-center gap-1">
                        <CircleCheck className="w-[16.67px] h-[16.67px] text-brand-secondary shrink-0" />
                        <span className="font-semibold text-base text-text-secondary">
                          {t(key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    {isMonthly ? (
                      <>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.monthlyLabel")}
                          </span>
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.monthlyPrice")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-brand-secondary">
                            {t("pricing.proPricing.earlyBird")}
                          </span>
                          <span className="font-normal text-base text-brand-secondary">
                            {t("pricing.proPricing.monthlyDiscount")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.tax")}
                          </span>
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.taxAmount")}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.yearlyLabel")}
                          </span>
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.yearlyPrice")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-brand-secondary">
                            {t("pricing.proPricing.earlyBird")}
                          </span>
                          <span className="font-normal text-base text-brand-secondary">
                            {t("pricing.proPricing.yearlyDiscount")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.tax")}
                          </span>
                          <span className="font-normal text-base text-text-secondary">
                            {t("pricing.proPricing.yearlyTax")}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {t("pricing.proPricing.dueToday")}
                    </span>
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {isMonthly
                        ? t("pricing.proPricing.monthlyTotal")
                        : t("pricing.proPricing.yearlyTotal")}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate("/pricing")}
                className="w-full h-16 px-2 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xl text-white transition-all duration-300 bg-accent-orange cursor-pointer hover:scale-105 active:scale-95"
              >
                {t("pricing.subscribeNow")}
              </button>

              <p className="text-center font-medium text-sm leading-[117%] text-placeholder">
                {t("pricing.terms")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
