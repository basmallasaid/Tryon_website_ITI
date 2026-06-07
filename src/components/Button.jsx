const variants = {
  signup: 'w-[104px] h-12 px-6 py-3 bg-gradient-to-r from-[#40B9FF] via-[#69C9AC] to-[#AAE338] text-white text-base',
  styling: 'w-[210px] h-16 px-2 py-2 bg-gradient-to-l from-[#A6E22E] via-[#74D6B6] to-[#40B9FF] text-white text-xl shadow-[0px_0px_7px_0px_#00000026]',
};

const Button = ({ children, variant, className = '', ...props }) => {
  const base = 'font-roboto font-semibold rounded-lg flex items-center justify-center transition-all';
  const style = variants[variant] || '';

  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
