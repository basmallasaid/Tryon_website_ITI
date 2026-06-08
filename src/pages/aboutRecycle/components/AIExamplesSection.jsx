import UpcycleExampleCard from './UpcycleExampleCard';
import { useTranslation } from 'react-i18next';

export default function AIExamplesSection() {
  const { t } = useTranslation();
  const examples = [
    {
      id: 1,
      before: '/short.png',
      after: '/bag.png',
      beforeLabel: t('aboutRecycle.oldJeans'),
      afterLabel: t('aboutRecycle.denimToteBag'),
      alt: 'Old denim jacket transformed into a stylish vest',
    },
    {
      id: 2,
      before: '/shirtbefore.png',
      after: '/shirtafter.png',
      beforeLabel: t('aboutRecycle.whiteDressShirt'),
      afterLabel: t('aboutRecycle.wrappedCropTop'),
      alt: 'Plain t-shirt turned into a trendy crop top',
    },
    {
      id: 3,
      before: '/short.png',
      after: '/bag.png',
      beforeLabel: t('aboutRecycle.oldJeans'),
      afterLabel: t('aboutRecycle.denimToteBag'),
      alt: 'Old denim jacket transformed into a stylish vest',
    },
  ];

  return (
    <section className="px-6 sm:px-10 lg:px-20 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            {t('aboutRecycle.aiCanCreate')}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('aboutRecycle.oldToNew')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map(example => (
            <UpcycleExampleCard key={example.id} {...example} />
          ))}
        </div>
      </div>
    </section>
  );
}
