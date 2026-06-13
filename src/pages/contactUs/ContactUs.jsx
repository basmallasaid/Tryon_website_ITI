import { useState } from "react";
import { useTranslation } from "react-i18next";
import Questions from "../home/components/Questions";
import { submitContactApi } from "../../api/adminApi";

const contactCards = [
  {
    icon: "mail",
    value: "redolapy.admin@gmail.com",
    href: "mailto:redolapy.admin@gmail.com",
  },
  {
    icon: "phone",
    value: "+20123456789",
    href: "tel:+20123456789",
  },
  {
    icon: "telegram",
    value: "+20123456789",
    href: "#",
  },
];

function ContactIcon({ type, className }) {
  if (type === "mail") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (type === "phone") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    );
  }
  if (type === "telegram") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22 11 13 2 9z" />
      </svg>
    );
  }
  return null;
}

export default function ContactUs() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setSubmitting(true);
    try {
      await submitContactApi({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f7]">
      {/* Main Content */}
      <section className="px-6 sm:px-10 lg:px-20 pt-16 pb-16 lg:pt-24 lg:pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column: Heading + Description + Contact Cards */}
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#121826] leading-tight">
              {t("contactUs.heading")}
            </h1>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mt-2 mb-6">
              <span
                style={{
                  background: "linear-gradient(90deg, #40B9FF 0%, #69C9AC 50%, #AAE338 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("contactUs.teamName")}
              </span>
            </h2>
            <p className="text-[#6b7280] text-base sm:text-lg leading-relaxed whitespace-pre-line mb-10 max-w-md">
              {t("contactUs.description")}
            </p>

            {/* Contact Cards */}
            <div className="flex flex-col gap-4">
              {contactCards.map((card) => (
                <div
                  key={card.icon}
                  className="rounded-lg bg-gradient-to-r from-[#a6e22e] via-[#74D6B6] to-[#40b9ff] p-[4px] max-w-sm"
                >
                  <a
                    href={card.href}
                    className="flex items-center gap-4 bg-white rounded-[4px] px-5 py-3 w-full"
                  >
                    <ContactIcon type={card.icon} className="w-5 h-5 text-[#121826] shrink-0" />
                    <span className="text-base font-semibold text-[#121826]">{card.value}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="flex flex-col justify-start lg:pt-16">
            {submitted ? (
              <div className="bg-white rounded-xl border border-[#d5d9de] p-10 text-center">
                <div className="w-16 h-16 bg-[#a6e22e]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#69C9AC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#121826] mb-2">{t("contactUs.sendButton")}!</h3>
                <p className="text-sm text-[#6b7280] mb-6">We'll get back to you soon.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-lg bg-[#40b9ff] hover:bg-[#33a8f0] text-white text-sm font-semibold transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-[#121826] mb-2">
                    {t("contactUs.nameLabel")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("contactUs.namePlaceholder")}
                    className="w-full h-12 px-4 rounded-lg border border-[#d5d9de] bg-white text-[#121826] text-sm placeholder:text-[#a0a6b2] outline-none focus:border-[#40b9ff] focus:ring-2 focus:ring-[#40b9ff]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#121826] mb-2">
                    {t("contactUs.emailLabel")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("contactUs.emailPlaceholder")}
                    className="w-full h-12 px-4 rounded-lg border border-[#d5d9de] bg-white text-[#121826] text-sm placeholder:text-[#a0a6b2] outline-none focus:border-[#40b9ff] focus:ring-2 focus:ring-[#40b9ff]/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#121826] mb-2">
                    {t("contactUs.messageLabel")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contactUs.messagePlaceholder")}
                    rows={7}
                    className="w-full px-4 py-3 rounded-lg border border-[#d5d9de] bg-white text-[#121826] text-sm placeholder:text-[#a0a6b2] outline-none resize-none focus:border-[#40b9ff] focus:ring-2 focus:ring-[#40b9ff]/20 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
                  className="w-full h-12 rounded-lg bg-[#40b9ff] hover:bg-[#33a8f0] active:scale-[0.98] text-white text-base font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Sending..." : t("contactUs.sendButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Questions />
    </div>
  );
}
