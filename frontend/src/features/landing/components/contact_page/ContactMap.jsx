export default function ContactMap() {
  return (
    <section className="bg-[var(--bg)] pb-20">
      <div className="mx-auto w-[85%] px-4">
        <h2 className="mb-10 text-center text-3xl md:text-4xl font-extrabold uppercase tracking-tight" style={{ color: 'var(--brand)' }}>
          Vị trí của EnerGym
        </h2>

        <div className="h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl border transition-all duration-300 shadow-sm" style={{ borderColor: 'var(--border)' }}>
          <iframe
            title="EnerGym Map"
            src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City,%20Vietnam&z=10&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
