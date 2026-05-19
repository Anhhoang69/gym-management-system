import { FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

export default function PackageCard({
    image,
    title = "Basic",
    price = "500.000",
    period = "tháng",
    description = "Mô tả gói tập.",
    features = [],
    highlight = false,
    onRegister,
}) {
    return (
        <div
            className={`
                relative
                rounded-[24px]
                bg-[#121212]
                border border-[#2a2a2a]
                text-white
                overflow-hidden
                shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                transition-all duration-300
                hover:-translate-y-2
                hover:shadow-[0_20px_40px_rgba(255,193,7,0.15)]
                h-full
                flex
                flex-col
                ${highlight ? "ring-2 ring-yellow-400 scale-105 shadow-[0_10px_40px_rgba(255,193,7,0.2)]" : ""}
            `}
        >
            {/* IMAGE */}
            <div className="relative h-[95px] shrink-0">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-2.5 pb-2.5 flex-grow flex flex-col justify-between">
                <div className="flex flex-col">
                    {/* TITLE */}
                    <h3 className="text-base font-semibold text-center">
                        {title}
                    </h3>

                    {/* PRICE */}
                    <div className="mt-1 flex items-end justify-center gap-1">
                        <span className="text-2xl font-extrabold text-white">{price}đ</span>
                        <span className="text-xs font-medium text-yellow-400 mb-1">/{period}</span>
                    </div>

                    {/* DESCRIPTION */}
                    <p className="mt-1 text-xs text-gray-300 text-center">
                        {description}
                    </p>

                    {/* FEATURES */}
                    <ul className="mt-1.5 space-y-0.5 text-left w-full">
                        {features.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs">
                                {item.available ? (
                                    <FaCheck className="text-yellow-400 mt-0.5 shrink-0" />
                                ) : (
                                    <FaTimes className="text-gray-500 mt-0.5 shrink-0" />
                                )}
                                <span className={item.available ? "" : "text-gray-500 line-through"}>
                                    {item.label}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <button style={{ borderRadius: '50px' }}
                    onClick={onRegister}
                    className="
                        group
                        mt-2
                        w-full
                        flex items-center justify-center gap-2
                        rounded-full
                        border border-white
                        py-1.5
                        text-sm font-medium
                        transition
                        cursor-pointer
                        hover:bg-white
                        hover:text-black
                    "
                >
                    Đăng Ký Ngay
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
