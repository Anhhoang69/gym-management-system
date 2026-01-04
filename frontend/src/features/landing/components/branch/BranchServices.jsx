import { Dumbbell, Users, User, Droplets, Coffee, Wifi } from 'lucide-react';

const services = [
  { icon: Dumbbell, title: 'Phòng tập máy & tạ hiện đại' },
  { icon: Users, title: 'Khu Functional Training' },
  { icon: User, title: 'Dịch vụ huấn luyện viên cá nhân (PT)' },
  { icon: Droplets, title: 'Phòng tắm & locker riêng' },
  { icon: Coffee, title: 'Quầy nước protein bar' },
  { icon: Wifi, title: 'Wifi & khu nghỉ lounge' },
];

const features = [
  {
    image:
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Phòng tập hiện đại',
    description:
      'Phòng tập hiện đại, trang bị nhiều thiết bị với công nghệ mới. Vượt khỏi tiêu chuẩn của phòng tập thông thường, CLB tích hợp đầy đủ tiện ích hồi phục năng lượng cùng với chương trình luyện tập đa dạng.',
  },
  {
    image:
      'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Khu vực Cardio',
    description:
      'Trang bị máy chạy bộ, xe đạp, máy chèo hiện đại với màn hình giải trí. Không gian thoáng đãng với tầm nhìn đẹp, tạo động lực tập luyện tối đa.',
  },
  {
    image:
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Free Weight Zone',
    description:
      'Khu vực tạ tự do rộng rãi với đầy đủ tạ đơn, tạ đòn, ghế tập đa năng. Phù hợp cho mọi cấp độ từ người mới bắt đầu đến vận động viên chuyên nghiệp.',
  },
];

export default function BranchServices() {
  return (
    <section className="py-20 transition-colors" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-4 text-center text-4xl font-bold lg:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          DỊCH VỤ & TIỆN ÍCH
        </h2>

        <div className="mt-12 mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="rounded-xl p-6 transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: 'var(--bg-third)', border: '1px solid var(--border)' }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'var(--brand)' }}
                >
                  <Icon className="h-6 w-6" style={{ color: 'var(--on-brand)' }} />
                </div>
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {service.title}
                </h3>
              </div>
            );
          })}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-2xl transition-all hover:shadow-2xl"
              style={{ backgroundColor: 'var(--bg-third)' }}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
