export default function PTCard({ image, name, specialty, experience }) {
  return (
    <div
      className="
        rounded-xl
        bg-[var(--surface)]
        shadow-md
        overflow-hidden
        transition
        hover:-translate-y-1
        hover:shadow-lg
      "
    >
      {/* IMAGE */}
      <img
        src={image}
        alt={name}
        className="h-60 w-full object-cover"
      />

      {/* CONTENT */}
      <div className="px-4 py-4 text-center">
        <h3 className="text-base font-semibold text-[var(--text-primary)]">
          {name}
        </h3>

        <p className="mt-1 text-sm font-medium text-[var(--brand)]">
          Chuyên môn: {specialty}
        </p>

        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          Kinh nghiệm: {experience}
        </p>
      </div>
    </div>
  );
}
