import { useState } from "react";
import { useTranslation } from "react-i18next";
import Questions from "../home/components/Questions";
import { Mail, Phone, Send, MessageSquare } from "lucide-react"; // استخدام مكتبة Lucide للأيقونات

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

export default function ContactUs() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for submission
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={`min-h-screen bg-[#F8FAFC] ${isArabic ? "rtl" : "ltr"}`}>
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">
                {t("contactUs.heading")}
              </h1>
              <h2 className="text-3xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] bg-clip-text text-transparent">
                  {t("contactUs.teamName")}
                </span>
              </h2>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                {t("contactUs.description")}
              </p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid gap-4">
              {contactCards.map((card, index) => (
                <a
                  key={index}
                  href={card.href}
                  className="group flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-secondary/30 transition-all duration-300"
                >
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
                    <p className="text-slate-700 font-bold">{card.value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {t("contactUs.nameLabel")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("contactUs.namePlaceholder")}
                      className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-slate-900 focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">
                      {t("contactUs.emailLabel")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("contactUs.emailPlaceholder")}
                      className="w-full h-14 px-5 rounded-2xl bg-slate-50 border-none text-slate-900 focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">
                    {t("contactUs.messageLabel")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("contactUs.messagePlaceholder")}
                    rows={5}
                    className="w-full p-5 rounded-2xl bg-slate-50 border-none text-slate-900 focus:ring-2 focus:ring-brand-secondary/20 transition-all outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-16 rounded-2xl bg-[var(--color-primary)] text-white font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-slate-200 active:scale-95 transition-all group"
                >
                  <span>{t("contactUs.sendButton")}</span>
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <div className="bg-white border-t border-slate-100">
        <Questions />
      </div>
    </div>
  );
}