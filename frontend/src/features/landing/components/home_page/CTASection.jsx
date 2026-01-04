import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CtaBg from "../../../../assets/cta-pt.webp";

export default function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden">
            {/* BACKGROUND IMAGE – quyết định chiều cao */}
            <img
                src={CtaBg}
                alt="Personal Trainer EnerGym"
                className="w-full h-auto"
            />

            {/* OVERLAY */}
            <div className="absolute inset-0 bg-black/70" />

            {/* CONTENT */}
            <div className="
                absolute inset-0
                z-10
                flex
                items-center
            ">
                <div className="
                    max-w-7xl
                    mx-auto
                    px-6
                    w-full
                ">
                    <div className="max-w-xl">
                        <h3 className="mt-10 text-3xl md:text-4xl font-bold text-yellow-400">
                            Bạn cần PT chuyên nghiệp?
                        </h3>

                        <p className="mt-10 text-base md:text-lg text-gray-200 leading-relaxed italic">
                            Tham khảo đội ngũ Huấn luyện viên của EnerGym tại đây: 
                        </p>

                        <button
                            onClick={() => navigate("/pt")}
                            className="
                                group
                                mt-10
                                inline-flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-yellow-400
                                px-7
                                py-4
                                text-base
                                font-semibold
                                text-black
                                transition
                                hover:bg-yellow-300
                            "
                        >
                            Huấn luyện viên
                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
