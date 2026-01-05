export default function ContactInfoCard({ title, content }) {
  return (
    <div className="aspect-square rounded-xl bg-[var(--bg-secondary)] p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.15),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
      <h4 className="text-xl text-center font-bold tracking-wide text-[var(--brand)]">
        {title}
      </h4>

      <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-[var(--text-secondary)]">
        {content}
      </p>
    </div>
  );
}
