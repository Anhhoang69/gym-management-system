import { Users, Gift } from 'lucide-react';
import Brush from '../../../../assets/brush.svg';

export default function SpecialOffers() {
  return (
    <section className="bg-(--bg) px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto text-center">
        <div className="relative mx-auto inline-block">
          <img
            src={Brush}
            alt=""
            aria-hidden="true"
            className="block w-[440px] md:w-[540px] lg:w-[570px]"
          />

          <span className="--text-secondary absolute inset-0 flex items-center justify-center text-4xl font-bold tracking-wide italic md:text-6xl">
            Ưu đãi đặc biệt
          </span>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Offer 1 */}
          <div
            className="rounded-2xl bg-(--bg-third) p-8 transition-all hover:scale-105"
            style={{ border: '2px solid var(--plan-basic)' }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--plan-basic)">
              <Users className="h-8 w-8" style={{ color: 'var(--on-plan-basic)' }} />
            </div>
            <h3 className="mb-3 text-center text-2xl font-bold text-(--text-primary)">
              Combo Bạn Bè
            </h3>
            <p className="mb-6 text-center text-(--text-secondary)">
              Học cùng bạn bè, tiết kiệm nhiều hơn
            </p>
            <button className="mb-6 w-full rounded-lg bg-(--plan-basic) py-3 font-semibold text-(--on-plan-basic) transition-all hover:opacity-90">
              Giảm 30%
            </button>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-lg">🎯</span>
                <span className="text-sm text-(--text-secondary)">
                  Khi đăng ký cùng từ 4-6 người
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">📅</span>
                <span className="text-sm text-(--text-secondary)">
                  Thời gian đăng ký dưới 12 tháng
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">✅</span>
                <span className="text-sm text-(--text-secondary)">
                  Áp dụng cho toàn bộ chi nhánh
                </span>
              </li>
            </ul>
            <button
              className="mt-6 w-full rounded-lg border-2 py-3 font-semibold transition-all hover:bg-(--plan-basic) hover:text-(--on-plan-basic)"
              style={{ borderColor: 'var(--plan-basic)', color: 'var(--plan-basic)' }}
            >
              Đăng ký Combo Bạn Bè
            </button>
          </div>

          {/* Offer 2 */}
          <div
            className="rounded-2xl bg-(--bg-third) p-8 transition-all hover:scale-105"
            style={{ border: '2px solid var(--plan-premium)' }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--plan-premium)">
              <Gift className="h-8 w-8" style={{ color: 'var(--on-plan-premium)' }} />
            </div>
            <h3 className="mb-3 text-center text-2xl font-bold text-(--text-primary)">
              Gói Trải Nghiệm 3 Ngày
            </h3>
            <p className="mb-6 text-center text-(--text-secondary)">
              Miễn phí thử nghiệm toàn bộ trang thiết bị
            </p>
            <button className="mb-6 w-full rounded-lg bg-(--plan-premium) py-3 font-semibold text-(--on-plan-premium) transition-all hover:opacity-90">
              Chỉ 0 đ
            </button>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-lg">🏋️</span>
                <span className="text-sm text-(--text-secondary)">Tập quyền với PT 3 ngày</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">💧</span>
                <span className="text-sm text-(--text-secondary)">Luôn có nước uống tiện ích</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">🎁</span>
                <span className="text-sm text-(--text-secondary)">Khăn tắm & khăn nhỏ cho bạn</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-lg">📊</span>
                <span className="text-sm text-(--text-secondary)">
                  Kiểm tra 25% cơ quan cơ thể khỏe
                </span>
              </li>
            </ul>
            <button
              className="mt-6 w-full rounded-lg border-2 py-3 font-semibold transition-all hover:bg-(--plan-premium) hover:text-(--on-plan-premium)"
              style={{ borderColor: 'var(--plan-premium)', color: 'var(--plan-premium)' }}
            >
              Đăng ký 3 ngày miễn phí
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
