import { useState } from "react";
import { useTranslation } from "react-i18next";
import Questions from "../home/components/Questions";
import { Mail, Phone, Send, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { submitContactApi } from "../../api/adminApi";

const contactCards = [
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email",
    value: "redolapy.admin@gmail.com",
    href: "mailto:redolapy.admin@gmail.com",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Phone",
    value: "+20 123 456 789",
    href: "tel:+20123456789",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    label: "Telegram",
    value: "@Redolapy_Support",
    href: "#",
    color: "from-lime-400 to-lime-600",
  },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactUs() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitContactApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setSubmitError(t('contactUs.sendFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-[var(--background)] ${isArabic ? "rtl" : "ltr"}`}>
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-black text-text-primary tracking-tight">
                  {t("contactUs.heading")}
                </h1>
                <h2 className="text-3xl lg:text-5xl font-bold">
                  <span className="bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] bg-clip-text text-transparent">
                    {t("contactUs.teamName")}
                  </span>
                </h2>
              </div>
              <div className="grid gap-4">
                {contactCards.map((card, index) => (
                  <a
                    key={index}
                    href={card.href}
                    className="group flex items-center gap-5 p-4 bg-surface-elevated rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:border-brand-secondary/30 transition-all duration-300"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      {card.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">{card.label}</p>
                      <p className="text-text-primary font-bold">{card.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="bg-surface-elevated rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-[var(--border)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                <div className="relative z-10 text-center py-12">
                  <CheckCircle className="w-16 h-16 text-success-text mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-text-primary mb-3">Message Sent!</h2>
                  <p className="text-text-secondary mb-8 max-w-md mx-auto">
                    Thank you for contacting us. We have received your message and will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="bg-surface-elevated border-t border-[var(--border)]">
          <Questions />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[var(--background)] ${isArabic ? "rtl" : "ltr"}`}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black text-text-primary tracking-tight">
                {t("contactUs.heading")}
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] bg-clip-text text-transparent">
                  {t("contactUs.teamName")}
                </span>
              </h2>
              <p className="text-text-secondary text-lg leading-relaxed max-w-md">
                {t("contactUs.description")}
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4">
              {contactCards.map((card, index) => (
                <a
                  key={index}
                  href={card.href}
                  className="group flex items-center gap-5 p-4 bg-surface-elevated rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md hover:border-brand-secondary/30 transition-all duration-300"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-disabled uppercase tracking-widest">{card.label}</p>
                    <p className="text-text-primary font-bold">{card.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-surface-elevated rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-[var(--border)] relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary ml-1">
                      {t("contactUs.nameLabel")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("contactUs.namePlaceholder")}
                      className={`w-full h-14 px-5 rounded-2xl bg-[var(--bg-secondary)] border-2 text-text-primary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none ${
                        errors.name ? 'border-error-border' : 'border-transparent'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-error-text text-xs ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-text-primary ml-1">
                      {t("contactUs.emailLabel")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("contactUs.emailPlaceholder")}
                      className={`w-full h-14 px-5 rounded-2xl bg-[var(--bg-secondary)] border-2 text-text-primary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none ${
                        errors.email ? 'border-error-border' : 'border-transparent'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-error-text text-xs ml-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-text-primary ml-1">
                    {t("contactUs.messageLabel")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contactUs.messagePlaceholder")}
                    rows={5}
                    className={`w-full p-5 rounded-2xl bg-[var(--bg-secondary)] border-2 text-text-primary focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none resize-none ${
                      errors.message ? 'border-error-border' : 'border-transparent'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-error-text text-xs ml-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <div className="flex items-center gap-2 p-3 bg-error-bg border border-error-border rounded-xl text-error-text text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-16 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{submitError ? 'Retry' : t("contactUs.sendButton")}</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-surface-elevated border-t border-[var(--border)]">
        <Questions />
      </div>
    </div>
  );
}
