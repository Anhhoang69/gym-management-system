export default function ContactMap() {
  return (
    <section className="bg-[var(--bg)] pb-20">
      <h2 className="text-center text-3xl font-bold text-[var(--text-primary)] mb-8">
        Vị trí của EnerGym
      </h2>

      <div className="mx-auto max-w-7xl px-6">
        <div className="h-[420px] w-full overflow-hidden rounded-xl shadow-lg">
          <iframe
            title="EnerGym Map"
            src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City&output=embed"
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
