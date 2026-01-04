import PricingCard from './PricingCard';

export default function PricingSection() {
  const plans = [
    {
      type: 'basic',
      title: 'Basic',
      subtitle: 'Hoàn hảo cho người mới bắt đầu hành trình fitness',
      monthlyPrice: '999.000đ',
      duration: '6 tháng',
      features: [
        'Sử dụng toàn bộ khu vực tập luyện',
        'Thiết bị gym hiện đại đầy đủ',
        'Phòng tắm & tủ khóa miễn phí',
        'Tài khoản ứng dụng tập luyện',
        'Tập luyện 7 ngày/tuần',
      ],
      limitations:
        'Người mới bắt đầu, tập luyện tự do, với nền tảng cơ bản về thể hình và muốn có mức giá đơn giản, dễ tiếp cận.',
    },
    {
      type: 'premium',
      title: 'Premium',
      subtitle: 'Nâng cấp trải nghiệm với quyền lợi gia tăng chuyên nghiệp',
      monthlyPrice: '1.500.000đ',
      duration: '12 tháng',
      features: [
        'Tất cả quyền lợi của gói Basic',
        '2 buổi PT miễn phí/tháng',
        'Ưu tiên gặp mặt trong 8h-17-20h',
        'Tham gia lớp Group-Class',
        'Đánh giá thể trạng định kỳ',
        'Khăn tập & nước uống miễn phí',
      ],
      limitations:
        'Người tập trình độ trung bình, muốn có sự dẫn dắt từ huấn luyện viên hoặc theo lớp học nhóm một cách linh hoạt hơn.',
      highlight: true,
    },
    {
      type: 'elite',
      title: 'Elite VIP',
      subtitle: 'Trải nghiệm đẳng cấp dành cho những ai yêu cầu cao nhất',
      monthlyPrice: '3.000.000đ',
      duration: '12 tháng',
      features: [
        'Tất cả quyền lợi của gói Premium',
        'PT riêng không giới hạn',
        'Khu VIP riêng với trang thiết bị cao cấp',
        'Massage & spa miễn phí',
        'Chế độ dinh dưỡng cá nhân hóa',
        'Ưu đãi đối tác nghỉ dưỡng',
      ],
      limitations:
        'Doanh nhân, vận động viên, hoặc người có nhu cầu tập luyện chuyên nghiệp, muốn có sự chăm sóc riêng và môi trường tập cao cấp nhất.',
    },
  ];

  return (
    <section className="bg-(--bg) px-4 py-16 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.type} {...plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
