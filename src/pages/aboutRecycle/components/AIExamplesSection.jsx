import UpcycleExampleCard from './UpcycleExampleCard';

const examples = [
  {
    id: 1,
    before: '/short.png',
    after: '/bag.png',
    beforeLabel: 'Old Jeans',
    afterLabel: 'Denim Tote Bag',
    alt: 'Old denim jacket transformed into a stylish vest',
  },
  {
    id: 2,
    before: '/shirtbefore.png',
    after: '/shirtafter.png',
    beforeLabel: 'White Dress Shirt',
    afterLabel: 'Wrapped Crop Top',
    alt: 'Plain t-shirt turned into a trendy crop top',
  },
  {
    id: 3,
    before: '/short.png',
    after: '/bag.png',
    beforeLabel: 'Old Jeans',
    afterLabel: 'Denim Tote Bag',
    alt: 'Old denim jacket transformed into a stylish vest',
  },
];

export default function AIExamplesSection() {
  return (
    <section className="px-6 sm:px-10 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-[28px] sm:text-[32px] lg:text-[36px] font-bold text-text-primary mb-4">
            See what AI can create
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            From old to new — endless creative possibilities.
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
