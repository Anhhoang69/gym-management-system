export default function ContactForm() {
  return (
    <form className="rounded-2xl p-6 border transition-all duration-300 shadow-sm hover:shadow-md" style={{ backgroundColor: 'var(--bg-third)', borderColor: 'var(--border)' }}>
      <h2 className="text-xl font-extrabold text-center mb-6 uppercase tracking-tight" style={{ color: 'var(--brand)' }}>
        Gửi yêu cầu tư vấn
      </h2>

      <div className="space-y-4">
        <Input label="Họ và tên" required />
        <Input label="Email" type="email" required />
        <Input label="Số điện thoại" required />

        <Select
          label="Chi nhánh"
          options={[
            "EnerGym Quận 1",
            "EnerGym Bình Thạnh",
            "EnerGym Thủ Đức",
          ]}
        />

        <Textarea label="Nội dung" required />
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-xl py-3 font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
        style={{
          backgroundColor: 'var(--brand)',
          color: 'var(--on-brand)',
        }}
      >
        Gửi Ngay
      </button>
    </form>
  );
}

/* ===================== */
/* INPUT */
/* ===================== */
function Input({ label, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        required={required}
        className="w-full rounded-xl border px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      />
    </div>
  );
}

/* ===================== */
/* SELECT */
/* ===================== */
function Select({ label, options = [], required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        required={required}
        className="w-full rounded-xl border px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      >
        <option value="">Chọn chi nhánh</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/* ===================== */
/* TEXTAREA */
/* ===================== */
function Textarea({ label, required = false }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        rows={3}
        required={required}
        className="w-full rounded-xl border px-4 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-[var(--brand)] focus:border-transparent"
        style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderColor: 'var(--border)',
          color: 'var(--text-primary)'
        }}
      />
    </div>
  );
}
