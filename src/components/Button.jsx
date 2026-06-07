const variants = {
  signup: 'w-[104px] h-12 px-6 py-3 bg-gradient-to-r from-[var(--Primary-Brand-color)] via-[#69C9AC] to-[#AAE338] text-white text-base',
  styling: 'w-[210px] h-16 px-2 py-2 bg-gradient-to-l from-[var(--Lime-Brand-color)] via-[#74D6B6] to-[var(--Primary-Brand-color)] text-white text-xl shadow-[0px_0px_7px_0px_#00000026]',
};

const Button = ({ children, variant, className = '', ...props }) => {
  const base = 'font-semibold rounded-lg flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95';
  const style = variants[variant] || '';

  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
