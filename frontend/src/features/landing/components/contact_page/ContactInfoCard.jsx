export default function ContactInfoCard({ title, content }) {
  return (
    <div className="rounded-xl bg-[var(--surface)] p-5 shadow-md">
      <h4 className="font-semibold text-[var(--brand)]">
        {title}
      </h4>

      <p className="mt-2 whitespace-pre-line text-sm text-[var(--text-secondary)]">
        {content}
      </p>
    </div>
  );
}
