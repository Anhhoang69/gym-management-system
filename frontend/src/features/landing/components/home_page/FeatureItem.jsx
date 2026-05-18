export default function FeatureItem({ icon, label }) {
    return (
        <div className="flex flex-col items-center text-center gap-5">
            <div className="
                flex items-center justify-center
                w-20 h-20 md:w-24 md:h-24
                rounded-[24px]
                bg-gradient-to-br from-[var(--bg-third)] to-[var(--surface)]
                border border-[var(--border)]
                shadow-[0_10px_20px_rgba(0,0,0,0.05)]
                text-4xl md:text-5xl
                text-yellow-500 
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(255,193,7,0.15)] hover:border-yellow-400/50
            ">
                {icon}
            </div>

            <span className="text-base md:text-lg font-bold tracking-wide text-[var(--text-primary)] mt-2">
                {label}
            </span>
        </div>
    );
}
