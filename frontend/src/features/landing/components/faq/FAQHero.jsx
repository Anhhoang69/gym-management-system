export default function FAQHero() {
  return (
    <div className="relative overflow-hidden px-4 py-16" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-4xl text-center">
        <div
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium"
          style={{
            backgroundColor: 'var(--brand)',
            color: 'var(--on-brand)',
          }}
        >
          Hỗ trợ 24/7
        </div>

        <div className="relative mb-6 inline-block">
          <svg
            className="absolute -inset-4 -z-10 h-auto w-[calc(100%+2rem)]"
            viewBox="0 0 800 200"
            preserveAspectRatio="none"
            style={{ top: '-20%', left: '-2%' }}
          >
            <path
              d="M 0,100 Q 200,20 400,100 T 800,100 L 800,200 L 0,200 Z"
              fill="var(--brand)"
              opacity="0.95"
            />
            <path
              d="M 0,120 Q 150,40 300,120 T 600,120 T 800,120 L 800,200 L 0,200 Z"
              fill="var(--brand)"
              opacity="0.7"
            />
          </svg>

          <h1
            className="relative px-8 py-4 text-5xl font-black italic md:text-6xl"
            style={{
              color: 'var(--text-primary)',
              textShadow: '2px 2px 0px var(--brand)',
            }}
          >
            Câu hỏi thường gặp
          </h1>
        </div>

        <p className="mb-8 text-lg italic md:text-xl" style={{ color: 'var(--text-secondary)' }}>
          Tìm câu trả lời cho mọi thắc mắc về EnerGym. Nếu không tìm thấy câu hỏi của bạn, hãy liên
          hệ với chúng tôi!
        </p>
      </div>
    </div>
  );
}
