import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const faqKeys = [
  { question: "questions.q0", answer: "questions.a0" },
  { question: "questions.q1", answer: "questions.a1" },
  { question: "questions.q2", answer: "questions.a2" },
];

export default function Questions() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full bg-bg-sustainability py-16">
      <div className="max-w-[768px] mx-auto px-8 max-[768px]:px-4">
        <h2 className="font-bold text-[36px] leading-[38px] text-center text-secondary-text mb-10">
          {t("questions.title")}
        </h2>

        <div className="flex flex-col gap-6">
          {faqKeys.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="relative overflow-hidden rounded-[16px] cursor-pointer"
                onClick={() => toggle(i)}
              >
                <span
                  className="absolute inset-0 p-[3px] rounded-[16px] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, #FF8A3D 0%, #40B9FF 53.37%, #8ED321 100%)",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                  }}
                />

                <div className="relative z-10 w-full px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-2xl leading-[38.4px] text-text-primary">
                      {t(faq.question)}
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 text-text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-4 font-normal text-base leading-6 text-text-secondary">
                        {t(faq.answer)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
