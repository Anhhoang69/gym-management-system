import { MapPin, Clock, Phone, Users } from 'lucide-react';

export default function BranchInfo() {
  return (
    <section className="relative flex min-h-[450px] items-center overflow-hidden bg-(--bg) transition-colors duration-300">
      {/* Background Overlay: Tự động điều chỉnh độ đậm nhạt theo Theme */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-(--bg) via-(--bg)/80 to-transparent dark:from-black dark:via-black/70 dark:to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* CỘT TRÁI: GIỚI THIỆU */}
          <div>
            <p className="mb-8 text-lg leading-relaxed text-(--text-secondary)">
              Energym Quận 1 - một không gian xứng tầm dành cho những người yêu thích lối sống khoẻ
              mạnh. Vượt khỏi tiêu chuẩn của phòng tập thông thường, CLB tích hợp đầy đủ tiện ích
              hồi phục năng lượng cùng với chương trình luyện tập đa dạng sẽ chiều lòng ngay cả
              những vị khách khó tính nhất.
            </p>

            <div className="mb-8 flex flex-wrap gap-4">
              {/* Nút XEM GÓI TẬP: Đổi sang màu Đỏ Cam #ff6b35 */}
              <button
                className="rounded-lg px-8 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#ff6b35' }}
              >
                XEM GÓI TẬP
              </button>

              {/* Nút ĐĂNG KÝ TẬP THỬ: Giữ màu vàng thương hiệu */}
              <button
                className="rounded-lg px-8 py-3 font-bold text-black shadow-lg transition-all hover:scale-105 hover:bg-yellow-300 active:scale-95"
                style={{ backgroundColor: 'var(--brand)' }}
              >
                ĐĂNG KÝ TẬP THỬ
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT (Glassmorphism) */}
          <div
            className="rounded-2xl p-8 shadow-xl backdrop-blur-md transition-colors duration-300"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-(--brand)" />
                <div>
                  <p className="mb-1 font-bold text-(--text-primary)">Địa chỉ</p>
                  <p className="text-(--text-secondary)">
                    25 Nguyễn Thị Minh Khai, P. Bến Nghé, Q.1, TP.HCM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-6 w-6 flex-shrink-0 text-(--brand)" />
                <div>
                  <p className="mb-1 font-bold text-(--text-primary)">Giờ mở cửa</p>
                  <p className="text-(--text-secondary)">5:00 – 22:00 T2 - CN</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="mt-1 h-6 w-6 flex-shrink-0 text-(--brand)" />
                <div>
                  <p className="mb-1 font-bold text-(--text-primary)">Hotline</p>
                  <p className="text-(--text-secondary)">0901 234 567</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="mt-1 h-6 w-6 flex-shrink-0 text-(--brand)" />
                <div>
                  <p className="mb-1 font-bold text-(--text-primary)">Đội ngũ PT</p>
                  <p className="text-3xl font-black text-(--text-primary)">8+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
