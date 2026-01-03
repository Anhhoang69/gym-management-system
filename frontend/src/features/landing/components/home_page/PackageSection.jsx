import PackageCard from "./PackageCard";
import Brush from "../../../../assets/brush.svg";

import pkg1 from "../../../../assets/package-1.webp";
import pkg2 from "../../../../assets/package-2.webp";
import pkg3 from "../../../../assets/package-3.webp";

export default function PackageSection() {
    return (
        <section className="bg-third py-10">
            {/* HEADER */}
            <div className="text-center mx-auto">

                {/* BRUSH TITLE */}
                <div className="relative inline-block mx-auto">
                    <img
                        src={Brush}
                        alt=""
                        aria-hidden="true"
                        className="block w-[440px] md:w-[540px] lg:w-[570px]"
                    />

                    <span
                        className="
                            absolute inset-0
                            flex items-center justify-center
                            font-bold italic
                            text-black
                            tracking-wide
                            text-4xl md:text-6xl
                        "
                    >
                        Gói Tập Độc Quyền
                    </span>
                </div>

                {/* DESCRIPTION */}
                <p className="block text-xl md:text-2xl italic text-primary">
                    EnerGym mang đến các gói tập được thiết kế linh hoạt,
                    phù hợp với nhiều mục tiêu và trình độ khác nhau.
                </p>
            </div>

            {/* CARDS */}
            <div className="
                mt-15
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-25
                max-w-7xl
                mx-auto
                px-6
            ">
                <PackageCard
                    image={pkg1}
                    title="Basic"
                    price="6.88"
                    period="month"
                    features={[
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                    ]}
                />

                <PackageCard
                    image={pkg2}
                    title="Standard"
                    price="9.88"
                    period="month"
                    highlight
                    features={[
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                        { label: "Lorem Ipsum is simply dummy text", available: false },
                    ]}
                />

                <PackageCard
                    image={pkg3}
                    title="Premium"
                    price="12.88"
                    period="month"
                    features={[
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                        { label: "Lorem Ipsum is simply dummy text", available: true },
                    ]}
                />
            </div>
        </section>
    );
}
