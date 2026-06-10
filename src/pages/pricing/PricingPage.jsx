import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, CircleCheck, ShieldCheck } from "lucide-react";
import Visa from "../../assets/Visa.svg";

const featureKeys = [
  "pricingPage.feature1",
  "pricingPage.feature2",
  "pricingPage.feature3",
  "pricingPage.feature4",
];

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === "rtl";

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  const digits = cardNumber.replace(/\s/g, "");
  const isCardNumberValid = digits.length === 16;
  const isExpiryValid = /^\d{2}\/\d{2}$/.test(expiry);
  const isCvvValid = /^\d{3}$/.test(cvv);
  const allFieldsValid = isCardNumberValid && isExpiryValid && isCvvValid;

  const formatCardNumber = (value) => {
    const d = value.replace(/\D/g, "").slice(0, 16);
    return d.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value) => {
    const d = value.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const handleCardChange = (e) =>
    setCardNumber(formatCardNumber(e.target.value));
  const handleExpiryChange = (e) => setExpiry(formatExpiry(e.target.value));
  const handleCvvChange = (e) =>
    setCvv(e.target.value.replace(/\D/g, "").slice(0, 3));

  const handleSubscribe = () => {
    if (!allFieldsValid) return;
  };

  return (
    <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="flex justify-center items-start gap-[103px] max-[1200px]:flex-col max-[1200px]:items-center max-[1200px]:gap-12">
          {/* ─── Left: Form ─── */}
          <div className="flex-1 max-w-[600px] max-[900px]:w-full">
            {/* Form card */}
            <div className="p-6 rounded-[16px] border border-border-strong bg-surface-elevated">
              <div className="flex flex-col gap-[19px]">
                {/* Back + Title */}
                <div className="flex items-center gap-4">
                  <div
                    className="flex items-center justify-center cursor-pointer shrink-0"
                    onClick={() => navigate("/")}
                  >
                    {isRtl ? (
                      <ArrowRight className="w-6 h-6 text-text-primary" />
                    ) : (
                      <ArrowLeft className="w-6 h-6 text-text-primary" />
                    )}
                  </div>
                  <span className="font-bold text-[36px] leading-[38px] text-text-primary">
                    {t("pricingPage.completeSubscription")}
                  </span>
                </div>

                {/* Payment Method + Form */}
                <div className="pt-6 pb-10 bg-surface-elevated shadow-[0px_1px_2px_0px_#0000000D]">
                  <div className="flex flex-col gap-6">
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {t("pricingPage.paymentMethod")}
                    </span>

                    <div className="w-[481px] max-[900px]:w-full flex flex-col gap-6">
                      {/* Card Number */}
                      <div className="w-full h-14 flex items-center justify-between rounded-[6px] border border-border-strong px-6 py-[13px] bg-surface-elevated">
                        <input
                          type="text"
                          placeholder={t("pricingPage.cardNumber")}
                          value={cardNumber}
                          onChange={handleCardChange}
                          className="flex-1 outline-none bg-transparent font-semibold text-base placeholder:text-placeholder text-text-primary"
                        />
                        <img src={Visa} alt="Visa" className="w-6 h-6 shrink-0" />
                      </div>

                      {/* MM/YY + CVV */}
                      <div className="flex gap-[17px] max-[500px]:flex-col">
                        <div className="flex-1 h-14 flex items-center rounded-[6px] border border-border-strong px-6 py-[13px] bg-surface-elevated">
                          <input
                            type="text"
                            placeholder={t("pricingPage.mmYY")}
                            value={expiry}
                            onChange={handleExpiryChange}
                            className="flex-1 outline-none bg-transparent font-semibold text-base placeholder:text-placeholder text-text-primary"
                          />
                        </div>
                        <div className="flex-1 h-14 flex items-center rounded-[6px] border border-border-strong px-6 py-[13px] bg-surface-elevated">
                          <input
                            type="text"
                            placeholder={t("pricingPage.cvv")}
                            value={cvv}
                            onChange={handleCvvChange}
                            className="flex-1 outline-none bg-transparent font-semibold text-base placeholder:text-placeholder text-text-primary"
                          />
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div className="w-full flex items-center gap-2 px-4">
                        <label className="relative flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveDetails}
                            onChange={(e) => setSaveDetails(e.target.checked)}
                            className="sr-only"
                          />
                          <div
                            className={`w-4 h-4 rounded-[2px] border flex items-center justify-center transition-colors ${
                              saveDetails
                                ? "bg-surface-elevated border-checkbox-border"
                                : "bg-surface-elevated border-checkbox-border"
                            }`}
                          >
                            {saveDetails && (
                              <svg
                                width="10"
                                height="8"
                                viewBox="0 0 10 8"
                                fill="none"
                              >
                                <path
                                  d="M1 4L3.5 6.5L9 1"
                                  stroke="#1E1E24"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </label>
                        <span className="font-normal text-base text-text-secondary">
                          {t("pricingPage.saveDetails")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security text */}
            <div className="mt-6 w-full flex items-center gap-3 px-4">
              <ShieldCheck
                style={{ width: 12, height: 15, color: "#1E1E24B2" }}
                className="shrink-0"
              />
              <span
                style={{
                  fontFamily: "Roboto",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: "117%",
                  color: "#1E1E24B2",
                }}
              >
                  {t("pricingPage.securedBy")}
              </span>
            </div>
          </div>

          {/* ─── Right: Pricing Card ─── */}
          <div className="relative w-[449px] max-[900px]:w-full rounded-[32px] overflow-hidden shrink-0">
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

            <div className="relative z-10 w-full h-full flex flex-col gap-8 py-8 px-10">
              {/* POPULAR badge */}
              <div className="w-[116px] rounded-full py-1 px-3 bg-accent-orange flex items-center justify-center">
                <span className="font-medium text-sm leading-[117%] text-surface-elevated">
                  {t("pricingPage.popular")}
                </span>
              </div>

              {/* Content with gap-56 */}
              <div className="flex flex-col gap-14 flex-1">
                {/* Pro plan section */}
                <div className="flex flex-col gap-6">
                  <h3 className="pb-2 font-bold text-[36px] leading-[38px] text-text-primary">
                    {t("pricingPage.proPlan")}
                  </h3>

                  <div className="flex flex-col gap-4">
                    {featureKeys.map((key, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <CircleCheck className="w-[16.67px] h-[16.67px] text-brand-secondary shrink-0" />
                        <span className="font-semibold text-base text-text-secondary">
                          {t(key)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing section */}
                <div className="flex flex-col gap-6">
                  {/* Rows group */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                      <span className="font-normal text-base text-text-secondary">
                        {t("pricingPage.monthlySubscription")}
                      </span>
                      <span className="font-normal text-base text-text-secondary">
                        {t("pricingPage.price19")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-normal text-base text-text-secondary">
                        {t("pricingPage.earlyBird")}
                      </span>
                      <span className="font-normal text-base text-brand-secondary">
                        {t("pricingPage.discount5")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-normal text-base text-text-secondary">
                        {t("pricingPage.estimatedTax")}
                      </span>
                      <span className="font-normal text-base text-text-secondary">
                        {t("pricingPage.tax1")}
                      </span>
                    </div>
                  </div>

                  {/* Due today */}
                  <div className="flex justify-between">
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {t("pricingPage.dueToday")}
                    </span>
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {t("pricingPage.totalDue")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscribe button */}
              <button
                onClick={handleSubscribe}
                disabled={!allFieldsValid}
                className={`w-full h-16 px-2 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xl text-[#F1F5F9] transition-all duration-300 ${
                  allFieldsValid
                    ? "bg-accent-orange cursor-pointer hover:scale-105 active:scale-95"
                    : "bg-placeholder cursor-not-allowed"
                }`}
              >
                {t("pricingPage.subscribe")}
              </button>

              {/* Terms */}
              <p className="text-center font-medium text-sm leading-[117%] text-placeholder">
                {t("pricingPage.terms")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
