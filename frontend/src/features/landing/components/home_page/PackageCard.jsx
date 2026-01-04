import { FaCheck, FaTimes, FaArrowRight } from "react-icons/fa";

export default function PackageCard({
    image,
    title = "Basic",
    price = "6.88",
    period = "month",
    description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    features = [],
    highlight = false,
}) {
    return (
        <div
            className={`
                relative
                rounded-[32px]
                bg-black
                text-white
                overflow-hidden
                shadow-xl
                transition
                hover:-translate-y-2
                hover:shadow-2xl
                ${highlight ? "ring-2 ring-yellow-400 scale-105" : ""}
            `}
        >
            {/* IMAGE */}
            <div className="relative h-[200px]">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            </div>

            {/* CONTENT */}
            <div className="p-6">
                {/* TITLE */}
                <h3 className="text-lg font-semibold text-center">
                    {title}
                </h3>

                {/* PRICE */}
                <div className="mt-3 flex items-end justify-center gap-1">
                    <span className="text-4xl font-bold">${price}</span>
                    <span className="text-sm text-yellow-400">/{period}</span>
                </div>

                {/* DESCRIPTION */}
                <p className="mt-4 text-sm text-gray-300 text-center">
                    {description}
                </p>

                {/* FEATURES */}
                <ul className="mt-6 space-y-3">
                    {features.map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-sm">
                            {item.available ? (
                                <FaCheck className="text-yellow-400" />
                            ) : (
                                <FaTimes className="text-gray-500" />
                            )}
                            <span className={item.available ? "" : "text-gray-500 line-through"}>
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <button
                    className="
                        group
                        mt-6
                        w-full
                        flex items-center justify-center gap-3
                        rounded-full
                        border border-white
                        py-3
                        text-sm font-medium
                        transition
                        hover:bg-white
                        hover:text-black
                    "
                >
                    Get Started
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                </button>
            </div>
        </div>
    );
}
