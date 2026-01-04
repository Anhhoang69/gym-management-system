import { Link } from 'react-router-dom';

export default function BranchHero() {
  return (
    <section className="relative h-[520px]">
      <img src="/images/branch-hcm.jpg" className="h-full w-full object-cover" />

      <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

      <div className="absolute right-0 bottom-0 left-0 mx-auto max-w-7xl px-6 pb-14">
        <p className="mb-2 text-sm text-gray-300">Chi nhánh • TP.HCM</p>

        <h1 className="text-4xl font-extrabold text-white sm:text-5xl">ENERGYM QUẬN 1</h1>

        <p className="mt-4 max-w-2xl text-gray-300">
          Không gian tập luyện cao cấp, huấn luyện viên chuyên nghiệp, trang thiết bị hiện đại.
        </p>

        <div className="mt-6 flex gap-4">
          <Link to="#" className="rounded bg-(--brand) px-6 py-3 font-semibold text-black">
            Xem gói tập
          </Link>

          <Link
            to="#register"
            className="rounded border border-white/30 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Đăng ký tập thử
          </Link>
        </div>
      </div>
    </section>
  );
}
