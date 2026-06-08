import human from '../../../assets/human.svg';
import { useTranslation } from 'react-i18next';

const Intro = () => {
  const { t } = useTranslation();
  const steps = [
    {
      num: '1',
      title: t('intro.step1Title'),
      desc: t('intro.step1Desc'),
    },
    {
      num: '2',
      title: t('intro.step2Title'),
      desc: t('intro.step2Desc'),
    },
    {
      num: '3',
      title: t('intro.step3Title'),
      desc: t('intro.step3Desc'),
    },
  ];

  return (
    <section className="w-full bg-bg-secondary pr-20 pb-57 pl-20 max-[1200px]:pr-14 max-[1200px]:pl-14 max-[1000px]:pr-8 max-[1000px]:pl-8 max-[1000px]:pb-8">
      <div className="flex justify-center gap-[72px] max-[1000px]:flex-col">
        <div className="relative w-[544px] h-[400px] max-[1000px]:w-full max-[1000px]:h-auto rounded-lg overflow-hidden shrink-0">
          <img src={human} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(250,248,255,0.8)] to-[rgba(250,248,255,0)]" />
        </div>

        <div className="w-[480px] h-[397px] max-[1000px]:w-full max-[1000px]:h-auto flex flex-col gap-10">
          <h2 className="font-bold text-[36px] leading-[38px] text-text-primary">
            {t('intro.title')}
          </h2>
          <div className="flex flex-col gap-8">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-6">
                <div className="w-10 h-10 rounded-full bg-accent-orange flex items-center justify-center shrink-0">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-base leading-6 text-surface-elevated">
                    {step.num}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-2xl leading-[38.4px] text-text-primary">
                    {step.title}
                  </h3>
                  <p className="font-normal text-base text-text-secondary">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
