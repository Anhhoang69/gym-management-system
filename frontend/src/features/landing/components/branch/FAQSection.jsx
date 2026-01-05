import { useState } from 'react';

const faqs = [
  {
    q: 'Tôi có thể đăng ký gói tập trực tiếp tại chi nhánh không?',
    a: 'Có. Bạn có thể đến bất kỳ chi nhánh EnergyM nào, nhân viên tư vấn sẽ hỗ trợ chọn gói phù hợp, hoặc bạn cũng có thể mua online và kích hoạt tại chi nhánh gần nhất.',
  },
  {
    q: 'Tôi có thể tập ở chi nhánh khác với nơi đăng ký ban đầu không?',
    a: 'Có. Với gói EnergyM All Access, bạn có thể tập luyện tại bất kỳ chi nhánh nào trong hệ thống EnergyM toàn quốc mà không cần đăng ký lại. Nếu bạn dùng gói Standard, vui lòng kiểm tra danh sách chi nhánh áp dụng trước khi đến.',
  },
  {
    q: 'Trang thiết bị ở các cơ sở có giống nhau không?',
    a: 'Về cơ bản, hệ thống phòng tập EnergyM đều được trang bị đầy đủ các thiết bị, dụng cụ với những khu vực tập luyện riêng biệt. Tuy nhiên, mỗi trung tâm sẽ có những thiết kế riêng đáp ứng những nhu cầu khác nhau của khách hàng nhằm tạo ra những trải nghiệm mới lạ và không trùng lặp.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="w-full bg-[#d9d9d9]">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="rounded-lg bg-[#d9d9d9] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <h2 className="mb-10 text-2xl font-bold tracking-wide text-gray-900 uppercase md:text-3xl lg:text-4xl">
            CÁC CÂU HỎI THƯỜNG GẶP (FAQ)
          </h2>

          <div className="space-y-8 lg:space-y-10">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={index}
                  className="cursor-pointer select-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <h3 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">
                    {item.q}
                  </h3>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? 'mt-4 max-h-[500px]' : 'max-h-0'
                    }`}
                  >
                    <p className="text-base leading-relaxed text-gray-700 md:text-lg lg:text-xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
