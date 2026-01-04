export default function ContactForm() {
  return (
    <form className="rounded-xl bg-[var(--surface)] p-8 shadow-lg">
      <div className="space-y-5">
        <Input label="Họ và tên (*)" />
        <Input label="Email (*)" type="email" />
        <Input label="Số điện thoại (*)" />
        <Input label="Gói tập quan tâm" />
        <Textarea label="Nội dung (*)" />
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

function Input({ label, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type={type}
        className="
          mt-2
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--bg)]
          px-4
          py-2.5
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--brand)]
        "
      />
    </div>
  );
}

function Textarea({ label }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--text-secondary)]">
        {label}
      </label>
      <textarea
        rows={4}
        className="
          mt-2
          w-full
          rounded-lg
          border
          border-[var(--border)]
          bg-[var(--bg)]
          px-4
          py-2.5
          focus:outline-none
          focus:ring-2
          focus:ring-[var(--brand)]
        "
      />
    </div>
  );
}
