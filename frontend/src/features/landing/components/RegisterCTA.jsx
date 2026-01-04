export default function RegisterCTA() {
  return (
    <section id="register" className="py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl bg-(--bg-third) px-6 py-10 shadow-lg sm:px-10">
          {/* Title */}
          <h2 className="mb-2 text-center text-2xl font-bold tracking-wide uppercase">
            Đăng ký tập thử miễn phí ngay hôm nay!
          </h2>

          <p className="mb-8 text-center text-sm text-(--text-secondary)">
            Hãy để lại thông tin để nhận tư vấn chi tiết về chương trình hội viên tại Energym và ưu
            đãi “Tập thử miễn phí” ngay hôm nay!
          </p>

          {/* Form */}
          <form className="grid gap-5 md:grid-cols-2">
            {/* Left column */}
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Chi nhánh</label>
                <select className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none">
                  <option>Chọn chi nhánh</option>
                  <option>EnerGym Quận 1</option>
                  <option>EnerGym Bình Thạnh</option>
                  <option>EnerGym Thủ Đức</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Gói tập quan tâm</label>
                <input
                  type="text"
                  placeholder="VD: Gym / PT / Yoga"
                  className="w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col">
              <label className="mb-1 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                className="mb-5 w-full rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
              />

              <label className="mb-1 block text-sm font-medium">Nội dung</label>
              <textarea
                rows={6}
                placeholder="Nội dung cần tư vấn..."
                className="w-full flex-1 resize-none rounded-md border border-(--border) bg-(--bg-secondary) px-4 py-3 text-sm focus:border-(--brand) focus:ring-2 focus:ring-(--brand)/30 focus:outline-none"
              />

              {/* Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-(--brand) px-8 py-3 text-sm font-semibold text-(--on-brand) transition hover:opacity-90 active:scale-[0.98]"
                >
                  ĐĂNG KÝ NGAY!
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
