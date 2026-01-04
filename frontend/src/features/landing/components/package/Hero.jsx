export default function Hero() {
  return (
    <section className="bg-(--bg) px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="relative mb-6 inline-block">
          {/* SVG tạo hiệu ứng highlight phía sau chữ */}
          <svg
            className="absolute inset-0 -z-0 h-full w-full"
            viewBox="0 0 500 120"
            preserveAspectRatio="none"
            style={{ transform: 'scale(1.2)' }}
          >
            <path
              d="M10,60 Q100,20 200,50 T400,60 T490,50"
              fill="none"
              stroke="var(--brand)"
              strokeWidth="80"
              strokeLinecap="round"
              opacity="0.9"
            />
          </svg>
          <h1 className="relative px-8 py-4 text-4xl font-bold text-(--text-primary) sm:text-5xl lg:text-6xl">
            Gói Tập Độc Quyền
          </h1>
        </div>
        <p className="mx-auto max-w-4xl text-base leading-relaxed text-(--text-secondary) sm:text-lg">
          EnerGym mang đến các gói tập được thiết kế linh hoạt, phù hợp với nhiều mục tiêu và nhu
          cầu mức tiêu dùng khác nhau.
        </p>
      </div>
    </section>
  );
}
