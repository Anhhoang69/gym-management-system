import { MapPin, ExternalLink } from 'lucide-react';

export default function Location() {
  return (
    <section className="py-20 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-16 text-center text-4xl font-bold lg:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          VỊ TRÍ CHI NHÁNH
        </h2>

        <div
          className="overflow-hidden rounded-2xl shadow-2xl"
          style={{ backgroundColor: 'var(--bg-third)' }}
        >
          <div className="relative aspect-video">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5253192429!2d106.69223631533438!3d10.771384262255986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3b0e7e8d4d%3A0x3f0cf12f6f6e6f6f!2zMjUgTmd1eeG7hW4gVGjhu4sgTWluaCBLaGFpLCBCw6huIE5naOG7iywgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            ></iframe>

            <div
              className="absolute right-6 bottom-6 left-6 rounded-xl p-6 backdrop-blur-md"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-white" />
                  <div>
                    <p className="mb-1 font-semibold text-white">EnerGym Quận 1</p>
                    <p className="text-sm text-gray-200">
                      25 Nguyễn Thị Minh Khai, P. Bến Nghé, Q.1, TP.HCM
                    </p>
                  </div>
                </div>
                <a
                  href="https://maps.google.com/?q=25+Nguyen+Thi+Minh+Khai,+Ben+Nghe,+District+1,+Ho+Chi+Minh+City"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-shrink-0 items-center gap-2 rounded-lg px-4 py-2 transition-all hover:opacity-90"
                  style={{ backgroundColor: 'var(--brand)', color: 'var(--on-brand)' }}
                >
                  <span className="hidden sm:inline">Chỉ đường</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
