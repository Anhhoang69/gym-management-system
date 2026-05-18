import { Phone, Mail, MapPin } from 'lucide-react';

export default function FAQContact() {
  return (
    <div className="px-4 py-16" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto w-[85%]">
        <div className="mb-12 text-center">
          <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 uppercase">
            Vẫn còn thắc mắc?
          </h2>
          <p style={{ color: 'var(--text-primary)' }} className="block text-lg md:text-xl italic max-w-5xl mx-auto">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi câu hỏi của bạn. Hãy liên hệ với chúng tôi!
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <div
            className="rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--bg-third)' }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              <Phone className="h-8 w-8" style={{ color: 'var(--on-brand)' }} />
            </div>
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Hotline
            </h3>
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Hỗ trợ 24/7
            </p>
            <a
              href="tel:0901234567"
              className="text-lg font-bold transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-primary)' }}
            >
              0901 234 567
            </a>
          </div>

          <div
            className="rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--bg-third)' }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              <Mail className="h-8 w-8" style={{ color: 'var(--on-brand)' }} />
            </div>
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Email
            </h3>
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Phản hồi trong 24h
            </p>
            <a
              href="mailto:support@energym.vn"
              className="text-lg font-bold break-all transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-primary)' }}
            >
              support@energym.vn
            </a>
          </div>

          <div
            className="rounded-2xl p-8 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: 'var(--bg-third)' }}
          >
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              <MapPin className="h-8 w-8" style={{ color: 'var(--on-brand)' }} />
            </div>
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Địa chỉ
            </h3>
            <p className="mb-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              10+ chi nhánh tại TP.HCM
            </p>
            <a
              href="#"
              className="text-lg font-bold transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-primary)' }}
            >
              Xem chi nhánh
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            className="rounded-lg px-8 py-3 font-semibold shadow-lg transition-all hover:scale-105"
            style={{
              backgroundColor: 'var(--brand)',
              color: 'var(--on-brand)',
            }}
          >
            Đăng ký tập thử miễn phí
          </button>
          <button
            className="rounded-lg border px-8 py-3 font-semibold transition-all hover:scale-105 hover:brightness-95"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border)',
            }}
          >
            Tư vấn ngay
          </button>
        </div>
      </div>
    </div>
  );
}
