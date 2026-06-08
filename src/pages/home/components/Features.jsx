import stars from '../../../assets/stars.svg';
import tryonIcon from '../../../assets/try-on.svg';
import recycle from '../../../assets/recycle.svg';

const cards = [
  {
    icon: stars,
    bg: '#40B9FF33',
    title: 'AI Recommendations',
    desc: 'Proprietary algorithms that learn your aesthetic and suggest outfits that actually match your personality.',
  },
  {
    icon: tryonIcon,
    bg: '#FEEFE5',
    title: 'Try-on',
    desc: 'Precise body mapping technology ensures you never have to guess your size across different brands again.',
  },
  {
    icon: recycle,
    bg: '#F0F8E6',
    title: 'Recycle',
    desc: 'Stay ahead of the curve with real-time analysis of global runway trends filtered through your style lens.',
  },
];

const Features = () => {
  return (
    <section className="w-full bg-bg-secondary pr-20 pb-20 pl-20 max-[1200px]:pr-14 max-[1200px]:pl-14 max-[1000px]:pr-8 max-[1000px]:pl-8 max-[1000px]:pb-8 flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-2">
        <h2 className="font-bold text-[48px] max-[1000px]:text-3xl leading-[76.8px] max-[1000px]:leading-tight text-center bg-gradient-to-r from-[#4FC3FF] via-[#74D6B6] to-[#ACF445] bg-clip-text text-transparent">
          Fashion Intelligence
        </h2>
        <p className="font-semibold text-base text-center text-text-secondary">
          Built for the next generation of style enthusiasts.
        </p>
      </div>

      <div className="flex items-center justify-center gap-8 max-[1200px]:flex-col">
        {cards.map((card) => (
          <div
            key={card.title}
            className="w-[356px] h-[356px] max-[1000px]:w-full rounded-2xl pt-10 pb-10 px-6 flex flex-col gap-4 shadow-[0_0_4px_0_#00000026] bg-surface-elevated"
          >
            <div
              className="w-[72px] h-[72px] rounded-lg flex items-center justify-center shadow-[0_0_4px_0_#00000026]"
              style={{ backgroundColor: card.bg }}
            >
              <img src={card.icon} alt="" className="w-8 h-8" />
            </div>
            <h3 className="pt-4 font-bold text-2xl leading-[34px] text-secondary-text">
              {card.title}
            </h3>
            <p className="opacity-80 font-normal text-base leading-[23px] text-text-secondary">
              {card.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
