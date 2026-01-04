export default function PTModal({ pt, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-10 w-full max-w-3xl rounded-xl bg-[var(--surface)] p-6 shadow-xl">
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-[var(--text-secondary)] hover:text-black"
        >
          ×
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <img
            src={pt.image}
            alt={pt.name}
            className="h-full w-full rounded-lg object-cover"
          />

          <div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)]">
              {pt.name}
            </h3>

            <p className="mt-2 text-base text-[var(--text-secondary)]">
              Chuyên môn: {pt.specialty}
            </p>

            <p className="mt-1 text-base text-[var(--text-secondary)]">
              Kinh nghiệm: {pt.experience}
            </p>

            <p className="mt-4 text-base text-[var(--text-secondary)]">
              Huấn luyện viên có nhiều năm kinh nghiệm, đã hỗ trợ hàng trăm học viên
              đạt được mục tiêu hình thể và sức khỏe mong muốn.
            </p>

            <button
              className="mt-6 rounded-lg bg-[var(--brand)] px-6 py-3 font-semibold text-black"
            >
              Đăng ký tập với PT này
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
