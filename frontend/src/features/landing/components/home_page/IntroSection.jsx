import FeatureItem from './FeatureItem';
import { FaUserTie, FaBuilding, FaDumbbell, FaArrowRight } from 'react-icons/fa';
import Runner from "../../../../assets/runner.webp";
import Brush from "../../../../assets/brush.svg";
import { useNavigate } from "react-router-dom";

export default function IntroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-[var(--bg)] overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* LEFT */}
          <div className="py-24 lg:py-32">
            <div className="relative inline-block">
              <img
                src={Brush}
                alt=""
                aria-hidden="true"
                className="block w-[260px] lg:w-[320px]"
              />
              <span className="absolute inset-0 flex items-center justify-center text-lg lg:text-3xl font-bold italic --text-secondary">
                EnerGym là ai?
              </span>
            </div>

            <h2 className="mt-8 text-4xl md:text-6xl font-bold leading-tight text-primary">
              Nâng Tầm Sức Khoẻ <br /> Và Hình Thể Của Bạn
            </h2>

            <div className="mt-10 grid grid-cols-3">
              <FeatureItem icon={<FaUserTie />} label="PT chuyên nghiệp" />
              <FeatureItem icon={<FaBuilding />} label="Chi nhánh hiện đại" />
              <FeatureItem icon={<FaDumbbell />} label="Thiết bị cao cấp" />
            </div>

            <div className="mt-16 flex">
              <button
                onClick={() => navigate("/branches")}
                className="group flex items-center gap-3 rounded-xl bg-[var(--inverse)] px-8 py-4 text-base font-medium text-[var(--on-inverse)] transition hover:opacity-90"
              >
                <span>Xem các chi nhánh của EnerGym tại đây</span>
                <FaArrowRight className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-[42vw]">
        <img
          src={Runner}
          alt="EnerGym runner"
          className="h-full w-full object-cover object-right"
        />
      </div>
    </section>
  );
}

