import PhoneIcon from '../icons/PhoneIcon';
import MailIcon from '../icons/MailIcon';
import TelegramIcon from '../icons/TelegramIcon';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const contactInfo = [
  { icon: PhoneIcon, value: '+20123456789', href: 'tel:+20123456789' },
  { icon: TelegramIcon, value: '+20123456789', href: 'https://t.me/+20123456789' },
  { icon: MailIcon, value: 'ReDolapy@gmail.com', href: 'mailto:ReDolapy@gmail.com' },
];

export default function Footer() {
  const { t } = useTranslation();
  const platformLinks = [
    { label: t("footer.styleGuide"), path: '/stores' },
    { label: t("footer.tryOnTech"), path: '/tryOn' },
    { label: t("footer.features"), path: '/about' },
  ];

  return (
    <footer className="bg-[var(--header-footer-bg)]">
      <div className="px-6 sm:px-10 lg:px-20 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 lg:gap-24">
            {/* Left Column — Brand */}
            <div className="md:col-span-1">
              <h2 className="text-3xl font-bold  text-text-primary tracking-tight mb-4">
                {t("footer.brand")}
              </h2>
              <p className="text-text-disabled leading-relaxed max-w-sm mb-8 font-semibold">
                {t("footer.tagline")}
              </p>
            </div>

            {/* Center Column — Platform */}
            <div className="md:col-span-1">
              <h3 className=" font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
                {t("footer.platform")}
              </h3>
              <ul className="space-y-4">
                {platformLinks.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      onClick={() => window.scrollTo(0, 0)}
                      className="text-text-disabled font-semibold hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column — Contact Us */}
            <div className="md:col-span-1">
              <h3 className=" font-semibold uppercase tracking-widest text-[var(--primary)] mb-2">
                {t("footer.connect")}
              </h3>
              <ul className="space-y-4">
                {contactInfo.map(item => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 text-text-disabled font-semibold hover:text-text-primary transition-colors"
                    >
                      <item.icon className="w-4 h-4 text-[var(--primary)] shrink-0" />
                      <span dir="ltr">{item.value}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-text-disabled text-xs mt-10">
                &copy; {new Date().getFullYear()} {t("footer.copyright")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
