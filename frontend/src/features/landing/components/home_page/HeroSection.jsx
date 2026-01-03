import ServiceCard from './ServiceCard';
import { FaDumbbell, FaHeartbeat, FaAppleAlt } from 'react-icons/fa';
import heroGym from "../../../../assets/hero-gym.jpeg";

export default function HeroSection() {
    return (
        <section
            className="relative min-h-screen pb-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroGym})` }}
        >
            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 pt-56 md:pt-60 text-center text-white">
                {/* HEADING */}
                <h1 className="font-bold uppercase">
                    <span className="block text-4xl md:text-6xl">
                        Chào mừng bạn đến với
                    </span>

                    <span className="mt-2 block text-5xl md:text-8xl lg:text-8xl text-yellow-400 italic leading-none">
                        EnerGym
                    </span>
                </h1>

                <p className=" block text-1xl md:text-2xl mt-4 md:pt-5 text-white italic">
                    Bắt đầu hành trình nâng tầm sức khoẻ cùng chúng tôi
                </p>

                {/* cards */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
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
