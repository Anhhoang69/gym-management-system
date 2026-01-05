export default function ContactForm() {
  return (
    <form className="rounded-xl bg-[var(--bg-secondary)] p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-6">
            Gửi yêu cầu tư vấn
          </h2>

      <div className="space-y-5">
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
        className="
          mt-6
          w-full
          rounded-lg
          bg-[var(--brand)]
          py-3
          font-semibold
          text-black
          transition
          hover:opacity-90
        "
      >
        Gửi
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
      <label className="block text-sm font-medium text-[var(--text-secondary)] ">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <input
        type={type}
        required={required}
        className="
          mt-2
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--brand)]
        "
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
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <select
        required={required}
        className="
          mt-2
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--brand)]
        "
      >
        <option value="">Chọn chi nhánh</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
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
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      <textarea
        rows={6}
        required={required}
        className="
          mt-2
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--surface)]
          px-4
          py-2.5
          text-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--brand)]
        "
      />
    </div>
  );
}
