import { useNavigate } from "react-router-dom";
import mirror from "../../../assets/mirror.svg";
import { useTranslation } from "react-i18next";

const Mirror = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="w-full h-[406px] max-[1100px]:h-auto bg-bg-sustainability mt-10 mb-10 py-8 px-20 max-[1200px]:px-14 max-[1100px]:px-8">
      <div className="flex items-center justify-center gap-[189px] max-[1100px]:flex-col max-[1100px]:gap-10 h-full">
        <div className="w-[347px] max-[1100px]:w-full flex flex-col gap-[30px]">
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-[36px] leading-[40px] text-secondary-text">
              {t("mirror.yourMirror")}
            </h2>
            <span className="font-bold text-[36px] leading-[38px] bg-gradient-to-r from-[#4FC3FF] via-[#74D6B6] to-[#ACF445] bg-clip-text text-transparent">
              {t("mirror.reimagined")}
            </span>
          </div>
          <p className="font-medium text-base leading-[22px] text-text-secondary opacity-[0.84]">
            {t("mirror.desc")}
          </p>
          <button
            onClick={() => navigate("/tryOn")}
            className="w-[210px] h-16 px-2 py-2 rounded-lg border-none bg-primary text-surface-elevated shadow-[0px_0px_7px_0px_#00000026] cursor-pointer hover:scale-105 active:scale-95 transition-transform font-semibold text-base"
          >
            {t("mirror.tryNow")}
          </button>
        </div>
        <img
          src={mirror}
          alt=""
          className="w-[579.5px] h-[325.97px] max-[1100px]:w-full max-[1100px]:h-auto rounded-lg object-cover shrink-0"
        />
      </div>
    </section>
  );
};

export default Mirror;
