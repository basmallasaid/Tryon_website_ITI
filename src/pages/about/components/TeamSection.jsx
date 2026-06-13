import { ExternalLink } from 'lucide-react';
import LinkedinIcon from '../../../icons/LinkedinIcon';
import { useTranslation } from 'react-i18next';

const teamMembers = [
  { id: 1, name: 'Basmala Said', linkedin: 'https://www.linkedin.com/in/basmala-said/', initials: 'BS', avatarBg: 'from-[#40B9FF] to-[#69C9AC]' },
  { id: 2, name: 'Mayar Ahmed Abdallah', linkedin: 'https://www.linkedin.com/in/mayar-ahmed-39934925a/', initials: 'MAA', avatarBg: 'from-[#8ED321] to-[#AAE338]' },
  { id: 3, name: 'Mostafa Salah', linkedin: 'https://www.linkedin.com/in/mostafa-salah-tayea/', initials: 'MS', avatarBg: 'from-[#FF8A3D] to-[#FF6B8A]' },
  { id: 4, name: 'Menna Walid', linkedin: 'https://www.linkedin.com/in/menna-walid-fadel/', initials: 'MW', avatarBg: 'from-[#40B9FF] to-[#006492]' },
  { id: 5, name: 'Ahmed Mohamed Ayoub', linkedin: 'https://www.linkedin.com/in/ahmed-azaz-33306823a/', initials: 'AMA', avatarBg: 'from-[#426900] to-[#8ED321]' },
  { id: 6, name: 'Nouran Sherif', linkedin: 'https://www.linkedin.com/in/nouran-sherif-46bab929a/', initials: 'NS', avatarBg: 'from-[#9A4600] to-[#FF8A3D]' },
  { id: 7, name: 'Kariman Ayman', linkedin: 'https://www.linkedin.com/in/kariman-ayman-1a6788200/', initials: 'KA', avatarBg: 'from-[#40B9FF] to-[#69C9AC]' },
  { id: 8, name: 'Enjy Ahmed Fawzy', linkedin: '#', initials: 'EAF', avatarBg: 'from-[#8ED321] to-[#AAE338]' },
  { id: 9, name: 'Samira Abdullah Mohamed', linkedin: '#', initials: 'SAM', avatarBg: 'from-[#FF8A3D] to-[#FF6B8A]' },
  { id: 10, name: 'Hassan Abd elmoniem Ahmed', linkedin: 'https://www.linkedin.com/in/hassan-abd-el-moniem-5b6511115/', initials: 'HAA', avatarBg: 'from-[#426900] to-[#8ED321]' },
];

export default function TeamSection() {
  const { t } = useTranslation();

  return (
    <section className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold mb-4 bg-gradient-to-r from-[#4FC3FF] via-[#74D6B6] to-[#ACF445] bg-clip-text text-transparent">
            {t('aboutPage.teamTitle')}
          </h2>
          <p className="text-text-disabled max-w-2xl mx-auto leading-relaxed">
            {t('aboutPage.teamSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div
              key={member.id}
              className="group relative"
            >
              <span
                className="absolute inset-0 p-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(90deg, var(--color-lime) 0%, var(--color-primary) 51.44%, var(--color-accent-orange) 100%)',
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              <div className="relative z-10 bg-surface-elevated/70 backdrop-blur-md rounded-2xl p-4 border border-[var(--border)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:border-transparent h-full flex flex-row items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${member.avatarBg} flex items-center justify-center shrink-0 shadow-md`}
                >
                  <span className="text-sm font-bold text-white">
                    {member.initials}
                  </span>
                </div>

                <div className="flex flex-col items-start min-w-0">
                  <h3 className="text-sm font-bold text-text-primary truncate w-full">
                    {member.name}
                  </h3>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold text-text-secondary hover:text-brand-secondary transition-colors focus-visible:outline-2 focus-visible:outline-brand-secondary rounded"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
