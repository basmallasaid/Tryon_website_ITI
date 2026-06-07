import ArrowRightIcon from '../../../icons/ArrowRightIcon';

export default function UpcycleExampleCard({
  before,
  after,
  beforeLabel,
  afterLabel,
  alt,
}) {
  return (
    <div className="bg-surface-elevated rounded-[32px] p-6 border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50">
          <img src={before} alt={alt} className="w-full h-full object-cover" />
        </div>
        <div className="shrink-0 flex items-center justify-center w-4 text-[#BEC8D2]">
          <ArrowRightIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-50">
          <img
            src={after}
            alt={`${alt} - after transformation`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5 items-center justify-between px-1">
        <p className="text-xs font-medium text-[#3E4850]">{beforeLabel}</p>
        <p className="text-sm font-normal text-[#006492]">{afterLabel}</p>
      </div>
    </div>
  );
}
