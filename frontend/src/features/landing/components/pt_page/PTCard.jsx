export default function PTCard({
  image,
  name,
  specialty,
  experience,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-xl
        bg-[var(--surface)]
        shadow-md
        overflow-hidden
        transition
        hover:-translate-y-1
        hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15),0_8px_10px_-6px_rgba(0,0,0,0.10)]
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
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {name}
        </h3>

        <p className="mt-1 text-base font-medium text-[var(--brand)]">
          Chuyên môn: {specialty}
        </p>

        <p className="mt-1 text-base text-[var(--text-secondary)]">
          Kinh nghiệm: {experience}
        </p>
      </div>
    </div>
  );
}
