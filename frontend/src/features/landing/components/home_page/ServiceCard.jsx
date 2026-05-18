export default function ServiceCard({ icon, title, description }) {
  return (
    <div className="mx-auto max-w-[280px] rounded-[28px] bg-white/10 backdrop-blur-md border border-white/20 px-6 py-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/20 hover:shadow-2xl">
      {/* icon */}
      <div className="mb-4 flex justify-center text-4xl text-yellow-400">
        {icon}
      </div>

      {/* title */}
      <h3 className="text-xl font-bold tracking-widest uppercase text-center">
        {title}
      </h3>

      {/* description */}
      <p className="mt-2 text-sm leading-relaxed text-gray-200 text-center">
        {description}
      </p>
    </div>
  );
}
