export default function ContactMap() {
  return (
    <section className="bg-[var(--bg)] pb-20">
      <h2 className="mb-8 text-center text-4xl md:text-6xl italic font-bold text-[var(--text-primary)]">
        Vị trí của EnerGym
      </h2>

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-[600px] w-full overflow-hidden rounded-xl shadow-lg">
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
