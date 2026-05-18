import ServiceCard from './ServiceCard';
import { FaDumbbell, FaHeartbeat, FaAppleAlt } from 'react-icons/fa';
import heroGym from "../../../../assets/hero-gym.jpeg";

export default function HeroSection() {
    return (
        <section
            className="relative min-h-screen lg:h-screen bg-cover bg-center flex flex-col justify-center overflow-hidden"
            style={{ backgroundImage: `url(${heroGym})` }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60 bg-gradient-to-b from-black/40 via-black/60 to-black/90" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center text-white w-full">
                {/* HEADING */}
                <h1 className="font-extrabold uppercase tracking-tight">
                    <span className="block text-3xl md:text-5xl text-gray-200">
                        Chào mừng bạn đến với
                    </span>

                    <span className="mt-2 block text-5xl md:text-7xl lg:text-[7rem] text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 italic leading-none drop-shadow-lg pb-2">
                        EnerGym
                    </span>
                </h1>

                <p className="block text-lg md:text-2xl mt-6 md:mt-8 text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
                    Bắt đầu hành trình nâng tầm sức khoẻ cùng chúng tôi
                </p>

                {/* cards */}
                <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
                    <ServiceCard
                        icon={<FaHeartbeat />}
                        title="TIẾN BỘ"
                        description="Đội ngũ chuyên gia của chúng tôi sẽ đồng hành cùng bạn để xây dựng lộ trình tập luyện cá nhân hóa, giúp bạn chinh phục mục tiêu một cách hiệu quả."
                    />
                    <ServiceCard
                        icon={<FaDumbbell />}
                        title="LUYỆN TẬP"
                        description="Với đa dạng bài tập và chương trình huấn luyện, bạn sẽ có mọi thứ cần thiết để đạt được thể trạng tốt nhất trong cuộc sống."
                    />
                    <ServiceCard
                        icon={<FaAppleAlt />}
                        title="DINH DƯỠNG"
                        description="Chúng tôi sẽ cùng bạn tạo nên kế hoạch dinh dưỡng cá nhân hóa, giúp bạn đạt được mục tiêu sức khỏe và hình thể của riêng mình."
                    />
                </div>
            </div>
        </section>
    );
}
