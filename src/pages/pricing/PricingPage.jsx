import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Check, CircleCheck, Loader2, Lock } from "lucide-react";
import { showToast } from "../../utils/toast";
import { useAuth } from "../../context/AuthContext";
import {
  createCheckoutSessionApi,
  cancelSubscriptionApi,
  syncSubscriptionApi,
} from "../../api/paymentApi";
import { getSettingsApi } from "../../api/userApi";
import { getSubscription, saveSubscription } from "../../services/indexedDB";
import AuthModal from "../../components/AuthModal";

const SUBSCRIPTION_CACHE_TTL = 5 * 60 * 1000;

const pricingKeys = {
  essential: {
    items: [
      "pricing.essential.items.0",
      "pricing.essential.items.1",
      "pricing.essential.items.2",
      "pricing.essential.items.3",
      "pricing.essential.items.4",
    ],
  },
  pro: {
    items: [
      "pricing.pro.items.0",
      "pricing.pro.items.1",
      "pricing.pro.items.2",
      "pricing.pro.items.3",
      "pricing.pro.items.4",
    ],
  },
};

function SuccessPopup({ open, onClose, t }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-lg border border-border-strong p-8 gap-6 bg-surface-elevated animate-fadeInScale flex flex-col items-center text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center">
          <CircleCheck className="w-8 h-8 text-success-text" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-roboto font-bold text-[24px] leading-[38.4px] text-text-primary">
            {t("pricing.successTitle")}
          </h3>
          <p className="font-roboto text-[16px] leading-[24px] text-text-secondary">
            {t("pricing.successDesc")}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-lg bg-gradient-to-r from-primary via-[#69C9AC] to-[#AAE338] font-semibold text-base text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
        >
          {t("pricing.successButton")}
        </button>
      </div>
    </div>
  );
}

function CancelModal({ open, onClose, onConfirm, cancelling, endDate }) {
  const { t } = useTranslation();
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-overlay px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] rounded-lg border border-border-strong p-4 gap-4 bg-surface-elevated animate-fadeInScale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full border-b border-border-strong pb-4 flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-roboto font-bold text-[24px] leading-[38.4px] text-text-primary text-center">
              {t("pricing.cancelModalTitle")}
            </h3>
            <p className="font-roboto text-[16px] leading-[17px] text-text-disabled text-center">
              {t("pricing.cancelModalDesc")}{" "}
              <span className="font-roboto font-medium text-[16px] leading-[17px] text-text-disabled">
                {endDate
                  ? new Date(endDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
              . {t("pricing.cancelModalEnd")}
            </p>
          </div>
        </div>

        <div className="flex justify-between pt-4 gap-4">
          <button
            onClick={onClose}
            className="w-[226px] max-sm:flex-1 h-10 rounded-lg border border-brand-secondary px-2 py-2 gap-2 cursor-pointer bg-transparent transition-all"
          >
            <span className="font-roboto font-medium text-[14px] leading-[117%] text-brand-secondary">
              {t("pricing.keepSubscription")}
            </span>
          </button>
          <button
            onClick={onConfirm}
            disabled={cancelling}
            className="w-[226px] max-sm:flex-1 h-10 rounded-lg bg-accent-orange px-2 py-2 gap-2 flex items-center justify-center cursor-pointer hover:opacity-90 transition-all disabled:opacity-50"
          >
            {cancelling && (
              <Loader2 className="w-4 h-4 animate-spin text-surface-elevated" />
            )}
            <span className="font-roboto font-medium text-[14px] leading-[117%] text-surface-elevated">
              {t("pricing.confirmCancellation")}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const isRtl = i18n.dir() === "rtl";

  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [isMonthly, setIsMonthly] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successPopupShown, setSuccessPopupShown] = useState(false);
  const isPostPayment = useRef(false);
  const retryIntervalRef = useRef(null);

  const fetchSubscription = useCallback(
    (retries = 0, delay = 1000) => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      getSettingsApi({ email: user.email })
        .then((res) => {
          if (res.data.subscriptionStatus === "active") {
            const storedInterval =
              localStorage.getItem("selectedInterval") || "month";
            const subData = {
              status: res.data.subscriptionStatus,
              subscriptionId: res.data.subscriptionId,
              endDate: res.data.subscriptionEndDate,
              interval: res.data.subscriptionInterval || storedInterval,
            };
            setSubscription(subData);
            setIsMonthly(
              (res.data.subscriptionInterval || storedInterval) === "month",
            );
            saveSubscription(user.id || user._id, subData);
            if (retryIntervalRef.current) {
              clearTimeout(retryIntervalRef.current);
              retryIntervalRef.current = null;
            }
            isPostPayment.current = false;
          } else if (isPostPayment.current && retries > 0) {
            retryIntervalRef.current = setTimeout(() => {
              fetchSubscription(retries - 1, delay);
            }, delay);
          } else {
            setSubscription(null);
            isPostPayment.current = false;
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    },
    [user],
  );

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setSearchParams({}, { replace: true });
      if (user) {
        isPostPayment.current = true;
        setShowSuccessPopup(true);
        const userId = user.id || user._id;
        syncSubscriptionApi({ userId })
          .then(() => fetchSubscription(3, 1000))
          .catch(() => fetchSubscription(3, 1000));
      } else {
        setJustSubscribed(true);
      }
      return;
    }
    if (searchParams.get("canceled") === "true") {
      showToast("info", "Payment was cancelled.");
      setSearchParams({}, { replace: true });
      return;
    }
    const userId = user?.id || user?._id;
    if (!userId) {
      setLoading(false);
      return;
    }
    getSubscription(userId).then((cached) => {
      if (cached && Date.now() - cached.updatedAt < SUBSCRIPTION_CACHE_TTL) {
        setSubscription(cached.data);
        setIsMonthly(cached.data.interval === "month");
        setLoading(false);
      }
    });
    fetchSubscription();
  }, []);

  useEffect(() => {
    if (
      user &&
      !searchParams.get("success") &&
      !searchParams.get("canceled") &&
      !isPostPayment.current
    ) {
      fetchSubscription();
    }
  }, [user]);

  useEffect(() => {
    if (justSubscribed && user) {
      setJustSubscribed(false);
      isPostPayment.current = true;
      setSearchParams({}, { replace: true });
      const userId = user.id || user._id;
      syncSubscriptionApi({ userId })
        .then(() => fetchSubscription(3, 1000))
        .catch(() => fetchSubscription(3, 1000));
    }
  }, [justSubscribed, user]);

  useEffect(() => {
    return () => {
      if (retryIntervalRef.current) {
        clearTimeout(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };
  }, []);

  const handleSubscribe = async () => {
    if (!user) return;
    localStorage.setItem("selectedInterval", isMonthly ? "month" : "year");
    setSubscribing(true);
    try {
      const res = await createCheckoutSessionApi({
        userId: user.id,
        plan: "pro",
        interval: isMonthly ? "month" : "year",
      });
      window.location.href = res.data.url;
    } catch {
      showToast(
        "error",
        t("pricing.checkoutFailed") || "Failed to start checkout.",
      );
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!user) return;
    setCancelling(true);
    try {
      await cancelSubscriptionApi({ userId: user.id });
      setShowCancelModal(false);
      setSubscription(null);
      localStorage.removeItem("selectedInterval");
      showToast("success", "Subscription cancelled.");
    } catch {
      showToast(
        "error",
        t("pricing.cancellationFailed") || "Cancellation failed.",
      );
    } finally {
      setCancelling(false);
    }
  };

  if (!user) {
    return (
      <>
        <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
          <div className="max-w-[1440px] mx-auto flex justify-center">
            <div className="w-full max-w-[500px] rounded-[32px] p-12 shadow-[0px_0px_4px_0px_#00000026] bg-surface-elevated flex flex-col items-center gap-6 text-center">
              <Lock className="w-16 h-16 text-primary" />
              <h3 className="font-bold text-[28px] leading-[36px] text-text-primary">
                {t("pricing.loginPromptTitle")}
              </h3>
              <p className="font-normal text-base leading-6 text-text-secondary">
                {t("pricing.loginPromptDesc")}
              </p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full h-14 rounded-lg bg-gradient-to-r from-primary via-[#69C9AC] to-[#AAE338] font-semibold text-xl text-white cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              >
                {t("pricing.loginButton")}
              </button>
            </div>
          </div>
        </section>
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
        />
      </>
    );
  }

  if (loading) {
    return (
      <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  const subscribed = !!subscription;

  return (
    <section className="w-full py-[110px] px-16 max-[1200px]:px-14 max-[900px]:px-8">
      <div className="max-w-[1440px] mx-auto">
        {subscribed ? (
          <div className="flex flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-4">
              <h2 className="font-roboto font-bold text-[48px] leading-[58px] text-center bg-[linear-gradient(90deg,#40B9FF_2.4%,#8ED321_100%)] bg-clip-text text-transparent">
                {t("pricing.manageTitle")}
              </h2>
              <p className="font-roboto font-semibold text-[20px] text-center text-text-secondary">
                {t("pricing.manageSubtitle")}
              </p>
            </div>
            <div className="flex justify-center w-full">
              <div className="relative w-[900px] max-w-full rounded-[32px] overflow-hidden shadow-[0_0_20px_4px_rgba(255,138,61,0.1),0_0_40px_8px_rgba(64,185,255,0.08),0_0_60px_12px_rgba(142,211,33,0.06)]">
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
                <div className="relative z-10 w-full flex flex-col gap-6 px-10 py-8 max-sm:px-6 max-sm:py-6">
                  <div className="flex flex-col gap-6 w-full">
                    <div className="w-fit py-1 px-3 rounded-full flex items-center justify-center bg-brand-secondary">
                      <span className="font-roboto font-medium text-[14px] leading-[117%] text-surface-elevated text-center">
                        {t("pricing.active")}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 pb-4 border-b border-border-strong">
                      <span className="font-roboto font-bold text-[24px] leading-[38.4px] text-text-primary">
                        {t("pricing.proStyle")}
                      </span>
                      <span className="font-roboto font-normal text-[12px] text-border-disabled">
                        {t("pricing.currentPlan")}
                      </span>
                    </div>

                    <div className="w-full flex flex-col sm:flex-row gap-4 sm:justify-between">
                      <div className="flex-1 h-[70px] rounded-[16px] border border-border-strong p-2 px-4 gap-2 bg-surface-elevated flex items-center">
                        <div className="flex flex-col gap-2">
                          <span className="font-roboto font-semibold text-[16px] text-text-secondary">
                            {t("pricing.billing")}
                          </span>
                          <span className="font-roboto font-medium text-[14px] leading-[117%] text-text-secondary">
                            {subscription?.interval === "year"
                              ? t("pricing.proPricing.yearlyTotal") + "/Year"
                              : t("pricing.proPricing.monthlyTotal") + "/Month"}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1 h-[70px] rounded-[16px] border border-border-strong p-2 px-4 gap-2 bg-surface-elevated flex items-center">
                        <div className="flex flex-col gap-2">
                          <span className="font-roboto font-semibold text-[16px] text-text-secondary">
                            {t("pricing.renews")}
                          </span>
                          <span className="font-roboto font-medium text-[14px] leading-[117%] text-text-secondary">
                            {subscription?.endDate
                              ? new Date(
                                  subscription.endDate,
                                ).toLocaleDateString(isRtl ? "ar" : "en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "—"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full border-b border-border-strong pb-4 flex flex-col gap-4">
                      <span className="font-roboto font-semibold text-[16px] text-text-primary">
                        {t("pricing.yourBenefits")}
                      </span>
                      <div className="pb-2 flex flex-col gap-2">
                        {pricingKeys.pro.items.map((key) => (
                          <div key={key} className="flex items-center gap-3">
                            <Check className="w-[14.34px] h-[10.79px] text-placeholder shrink-0" />
                            <span className="font-roboto font-normal text-[15px] text-placeholder">
                              {t(key)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {subscription?.subscriptionId !== "pending" && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="w-full h-[65px] p-[10px] gap-[10px] rounded-lg bg-accent-orange cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                    >
                      <span className="font-roboto font-semibold text-[16px] text-surface-elevated">
                        {t("pricing.cancelSubscription")}
                      </span>
                    </button>
                  )}
                </div>
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
                  disabled={subscribing}
                  className="relative z-10 w-1/2 h-full rounded-full font-roboto font-bold text-[24px] leading-[38.4px] transition-colors duration-300 cursor-pointer"
                  style={{
                    color: isMonthly
                      ? "var(--color-text-primary)"
                      : "var(--color-border-disabled)",
                  }}
                >
                  {t("pricing.monthly")}
                </button>
                <button
                  onClick={() => setIsMonthly(false)}
                  disabled={subscribing}
                  className="relative z-10 w-1/2 h-full rounded-full font-roboto font-bold text-[24px] leading-[38.4px] transition-colors duration-300 cursor-pointer"
                  style={{
                    color: !isMonthly
                      ? "var(--color-text-primary)"
                      : "var(--color-border-disabled)",
                  }}
                >
                  {t("pricing.yearly")}
                </button>
              </div>
            </div>

            <div className="flex items-stretch justify-center gap-8 max-[1100px]:flex-col">
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

              <div className="relative w-[449px] max-[1100px]:w-full rounded-[32px] overflow-hidden shrink-0 shadow-[0_0_20px_4px_rgba(255,138,61,0.1),0_0_40px_8px_rgba(64,185,255,0.08),0_0_60px_12px_rgba(142,211,33,0.06)]">
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
                    className="w-full h-16 px-2 py-2 rounded-lg flex items-center justify-center gap-2 font-semibold text-xl text-white transition-all duration-300 bg-accent-orange cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    {subscribing && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
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
          endDate={subscription?.endDate}
        />
        <SuccessPopup
          open={showSuccessPopup}
          onClose={() => {
            setShowSuccessPopup(false);
            setSuccessPopupShown(true);
          }}
          t={t}
        />
      </div>
    </section>
  );
}
