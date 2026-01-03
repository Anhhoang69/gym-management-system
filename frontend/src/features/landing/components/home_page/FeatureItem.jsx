export default function FeatureItem({ icon, label }) {
    return (
        <div className="flex flex-col items-center text-center gap-5">
            <div className="
                flex items-center justify-center
                w-30 h-30
                rounded-2xl
                bg-white
                shadow-md
                text-7xl
                text-gray-900 
            ">
                {icon}
            </div>

            <span className="text-xl font-semibold tracking-wide">
                {label}
            </span>
        </div>
    );
}
