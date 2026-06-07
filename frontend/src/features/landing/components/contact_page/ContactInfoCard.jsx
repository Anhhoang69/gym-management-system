export default function ContactInfoCard({ title, content }) {
  return (
    <div className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-md" 
      style={{ 
        backgroundColor: 'var(--bg-third)', 
        borderColor: 'var(--border)' 
      }}
    >
      <h4 className="text-lg font-bold uppercase tracking-tight mb-3" style={{ color: 'var(--brand)' }}>
        {title}
      </h4>

      <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
        {content}
      </div>
    </div>
  );
}
