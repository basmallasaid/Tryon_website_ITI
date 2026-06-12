import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, CircleCheck, Loader2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  createCheckoutSessionApi,
  cancelSubscriptionApi,
  syncSubscriptionApi,
} from "../../api/paymentApi";
import { getSettingsApi } from "../../api/userApi";

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

function CancelModal({ open, onClose, onConfirm, cancelling }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] bg-surface-elevated rounded-[24px] p-8 relative animate-fadeInScale">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 cursor-pointer text-text-secondary hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="font-bold text-2xl leading-[38px] text-text-primary mb-2">
          Cancel Subscription
        </h3>
        <p className="font-normal text-base leading-6 text-text-secondary mb-8">
          Are you sure you want to cancel your Pro subscription? You&apos;ll
          lose access to premium features at the end of your current billing
          period.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-lg border border-border-strong bg-transparent font-semibold text-base text-text-primary cursor-pointer hover:bg-gray-50 transition-all"
          >
            Keep Plan
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="flex-1 h-12 rounded-lg bg-red-500 font-semibold text-base text-white flex items-center justify-center gap-2 cursor-pointer hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {cancelling && <Loader2 className="w-4 h-4 animate-spin" />}
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState(null);
  const [isMonthly, setIsMonthly] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const fetchSubscription = (retries = 5, delay = 1500) => {
    if (!user) return;
    setLoading(true);
    const attempt = (remaining) => {
      getSettingsApi({ email: user.email })
        .then((res) => {
          if (res.data.subscriptionStatus === "active") {
            setSubscription({
              status: res.data.subscriptionStatus,
              subscriptionId: res.data.subscriptionId,
              endDate: res.data.subscriptionEndDate,
            });
            setLoading(false);
          } else if (remaining > 1) {
            setTimeout(() => attempt(remaining - 1), delay);
          } else {
            setSubscription(null);
            setLoading(false);
          }
        })
        .catch(() => {
          if (remaining > 1) {
            setTimeout(() => attempt(remaining - 1), delay);
          } else {
            setSubscription(null);
            setLoading(false);
          }
        });
    };
    attempt(retries);
  };

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setMessage({ type: "success", text: "Subscription activated! Welcome to Pro." });
      setSearchParams({}, { replace: true });
      if (user) {
        syncSubscriptionApi({ userId: user.id })
          .then(() => fetchSubscription(3, 1000))
          .catch(() => fetchSubscription(3, 1000));
      }
    } else if (searchParams.get("canceled") === "true") {
      setMessage({ type: "error", text: "Payment was cancelled." });
      setSearchParams({}, { replace: true });
    } else {
      fetchSubscription();
    }
  }, [user]);

  const handleSubscribe = async () => {
    if (!user) return;
    setSubscribing(true);
    setMessage(null);
    try {
      const res = await createCheckoutSessionApi({
        userId: user.id,
        plan: "pro",
        interval: isMonthly ? "month" : "year",
      });
      window.location.href = res.data.url;
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to start checkout.",
      });
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    setCancelling(true);
    setMessage(null);
    try {
      await cancelSubscriptionApi({ userId: user.id });
      setMessage({ type: "success", text: "Subscription cancelled." });
      setShowCancelModal(false);
      setSubscription(null);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Cancellation failed.",
      });
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    return (
      <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
        <div className="max-w-[1440px] mx-auto text-center">
          <p className="text-xl text-text-secondary">
            Please log in to subscribe.
          </p>
        </div>
      </section>
    );
  }

  const subscribed = !!subscription;

  return (
    <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
      <div className="max-w-[1440px] mx-auto">
        {message && (
          <div
            className={`mb-12 px-6 py-4 rounded-lg text-center font-semibold text-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {subscribed ? (
          <div className="flex justify-center">
            <div className="relative w-[449px] max-w-full rounded-[32px] overflow-hidden">
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
              <div className="relative z-10 w-full flex flex-col items-center gap-8 py-12 px-10 text-center">
                <CircleCheck className="w-14 h-14 text-brand-secondary" />
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-[36px] leading-[38px] text-text-primary">
                    {t("pricing.pro.name")}
                  </h3>
                  <p className="font-semibold text-xl text-text-secondary">
                    You&apos;re subscribed to Pro!
                  </p>
                </div>
                <div className="w-full flex flex-col gap-2 py-4 px-6 rounded-[16px] bg-bg-primary">
                  <div className="flex justify-between">
                    <span className="font-normal text-base text-text-secondary">Plan</span>
                    <span className="font-semibold text-base text-text-primary">Pro Stylist</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-base text-text-secondary">Billing</span>
                    <span className="font-semibold text-base text-text-primary">
                      {isMonthly ? "Monthly" : "Yearly"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-normal text-base text-text-secondary">Renewal date</span>
                    <span className="font-semibold text-base text-text-primary">
                      {subscription?.endDate
                        ? new Date(subscription.endDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full h-14 rounded-lg border-2 border-red-400 text-red-500 font-semibold text-lg cursor-pointer hover:bg-red-50 transition-all"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          </div>
        ) : (
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
              <div className="flex items-center bg-[#ededed] rounded-full gap-1 p-1 w-full h-full">
                <button
                  onClick={() => setIsMonthly(true)}
                  disabled={subscribing}
                  className={`w-1/2 h-full rounded-full px-6 font-roboto font-bold text-[24px] leading-[38.4px] transition-all cursor-pointer ${
                    isMonthly
                      ? "border border-[#e9ebee] bg-surface-elevated shadow-[0px_1px_2px_0px_#0000000D] text-text-primary"
                      : "text-border-disabled"
                  }`}
                >
                  {t("pricing.monthly")}
                </button>
                <button
                  onClick={() => setIsMonthly(false)}
                  disabled={subscribing}
                  className={`w-1/2 h-full rounded-full px-6 font-roboto font-bold text-[24px] leading-[38.4px] transition-all cursor-pointer ${
                    !isMonthly
                      ? "border border-[#e9ebee] bg-surface-elevated shadow-[0px_1px_2px_0px_#0000000D] text-text-primary"
                      : "text-border-disabled"
                  }`}
                >
                  {t("pricing.yearly")}
                </button>
              </div>
            </div>

            <div className="flex items-stretch justify-center gap-8 max-[1100px]:flex-col">
              <div className="w-[449px] max-[1100px]:w-full rounded-[32px] py-8 max-[1100px]:py-6 px-10 shadow-[0px_0px_4px_0px_#00000026] bg-surface-elevated flex flex-col gap-8">
                <div className="w-[154px] h-8 rounded-full py-1 px-3 bg-[#a1a7b3] flex items-center justify-center self-start">
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
                    onClick={handleSubscribe}
                    disabled={subscribing}
                    className="w-full h-16 px-2 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xl text-[#F1F5F9] transition-all duration-300 bg-accent-orange cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {subscribing && <Loader2 className="w-5 h-5 animate-spin" />}
                    {t("pricing.subscribeNow")}
                  </button>

                  <p className="text-center font-medium text-sm leading-[117%] text-placeholder">
                    {t("pricing.terms")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <CancelModal
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancel}
          cancelling={cancelling}
        />
      </div>
    </section>
  );
}
