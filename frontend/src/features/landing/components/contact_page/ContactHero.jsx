import ContactHeroBG from "../../../../assets/contact-hero.webp";

export default function ContactHero() {
    return (
        <section className="relative h-[420px] md:h-[520px] overflow-hidden">
            <img
                src={ContactHeroBG}
                alt="Contact Hero"
                className="absolute inset-0 h-full w-full object-cover"
            />


            {/* overlay */}
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                <h1 className="font-bold uppercase">
                    <span className="block text-4xl md:text-6xl text-white">
                        Liên hệ với
                    </span>

                    <span className="mt-2 block text-5xl md:text-8xl lg:text-8xl text-yellow-400 italic leading-none">
                        EnerGym
                    </span>
                </h1>
            </div>
        </section>
    );
}
