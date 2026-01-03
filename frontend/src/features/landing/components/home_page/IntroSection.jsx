import FeatureItem from './FeatureItem';
import { FaUserTie, FaBuilding, FaDumbbell, FaArrowRight } from 'react-icons/fa';
import Runner from "../../../../assets/runner.webp";
import Brush from "../../../../assets/brush.svg";
import { useNavigate } from "react-router-dom";

export default function IntroSection() {
    const navigate = useNavigate();

    return (
        <section className="bg-third py-10">
            <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* LEFT */}
                <div>
                    <div className="relative inline-block">
                        <img
                            src={Brush}
                            alt=""
                            aria-hidden="true"
                            className="block w-[260px] lg:w-[320px]"
                        />

                        <span className="
                            absolute inset-0
                            flex items-center justify-center
                            text-lg lg:text-3xl
                            font-bold italic
                            text-black
                            tracking-wide
                        ">
                            EnerGym là ai?
                        </span>
                    </div>

                    <h2 className="mt-8 text-4xl md:text-6xl font-bold leading-tight text-gray-900">
                        Nâng Tầm Sức Khoẻ <br /> Và Hình Thể Của Bạn
                    </h2>

                    <div className="mt-10 grid grid-cols-3">
                        <FeatureItem icon={<FaUserTie />} label="PT chuyên nghiệp" />
                        <FeatureItem icon={<FaBuilding />} label="Chi nhánh hiện đại" />
                        <FeatureItem icon={<FaDumbbell />} label="Thiết bị cao cấp" />
                    </div>

                    <div className="mt-16 flex justify-center">
                        <button
                            onClick={() => navigate("/branches")}
                            className="
                                group
                                flex items-center gap-3
                                rounded-xl
                                bg-gray-900
                                px-8 py-4
                                text-base font-medium
                                text-white
                                transition
                                hover:bg-gray-800
                            "
                        >
                            <span>Xem các chi nhánh của EnerGym tại đây</span>
                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="relative overflow-visible">
                    <img
                        src={Runner}
                        alt="EnerGym runner"
                        className="w-full lg:w-[135%] lg:translate-x-12"
                    />
                </div>
            </div>
        </section>
    );
}
