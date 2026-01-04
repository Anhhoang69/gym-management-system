import pkg3 from "../../../../assets/package-3.webp";

export default function PTHero() {
    return (
        <section className="relative h-[420px] md:h-[520px] overflow-hidden">
            <img
                src={pkg3}
                alt="PT Hero"
                className="absolute inset-0 h-full w-full object-cover"
            />


            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <h1 className="font-bold uppercase">
                    <span className="block text-4xl md:text-6xl text-white">
                        Đội ngũ
                    </span>

                    <span className="mt-2 block text-5xl md:text-8xl lg:text-8xl text-yellow-400 italic leading-none">
                        Huấn luyện viên
                    </span>
                </h1>
            </div>
        </section>
    );
}
