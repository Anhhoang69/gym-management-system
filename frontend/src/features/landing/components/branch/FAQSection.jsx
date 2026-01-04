import { Link } from 'react-router-dom';

export default function FAQSection() {
  return (
    <div className="bg-(--bg-secondary) py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-10 text-2xl font-bold">CÁC CÂU HỎI THƯỜNG GẶP (FAQ)</h2>

        <div className="space-y-6 text-(--text-secondary)">
          <div>
            <h3 className="font-semibold text-(--text-primary)">
              Tôi có thể đăng ký gói tập trực tiếp tại chi nhánh không?
            </h3>
            <p>
              Có. Bạn có thể đến bất kỳ chi nhánh EnergyM nào, nhân viên tư vấn sẽ hỗ trợ chọn gói
              phù hợp.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-(--text-primary)">
              Tôi có thể tập ở chi nhánh khác với nơi đăng ký ban đầu không?
            </h3>
            <p>
              Với gói EnergyM All Access, bạn có thể tập luyện tại bất kỳ chi nhánh nào trên toàn
              quốc.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-(--text-primary)">
              Trang thiết bị ở các cơ sở có giống nhau không?
            </h3>
            <p>
              Các phòng tập đều được trang bị đầy đủ thiết bị, tuy nhiên mỗi cơ sở có thể có không
              gian và bố trí khác nhau.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-xl bg-black p-8 text-white md:flex md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold">Đăng ký tập thử miễn phí ngay hôm nay!</h3>
            <p className="mt-2 text-sm text-gray-300">
              Để lại thông tin liên hệ, đội ngũ EnergyM sẽ tư vấn lịch tập phù hợp cho bạn.
            </p>
          </div>

          <Link
            to="/register"
            className="mt-6 inline-block rounded-lg bg-(--brand) px-6 py-3 font-semibold text-black md:mt-0"
          >
            Đăng ký ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
