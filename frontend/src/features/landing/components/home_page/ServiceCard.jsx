export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="mx-auto max-w-[280px] rounded-[28px] bg-white px-8 py-10 text-gray-800 shadow-lg transition hover:-translate-y-1">
      {/* icon */}
      <div className="mb-6 text-4xl text-500">
        {icon}
      </div>

      {/* title */}
      <h3 className="text-xl font-bold tracking-wide">
        {title}
      </h3>

      {/* description */}
      <p className="mt-4 text-base leading-relaxed text-gray-700">
        {description}
      </p>
    </div>
  );
}
