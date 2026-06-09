import { useState } from 'react';
import { useLanguage } from '../../../../shared/contexts/LanguageContext';

const faqs = {
  vi: [
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
  ],
  en: [
    {
      q: 'Can I register for a membership package directly at the branch?',
      a: 'Yes. You can visit any EnerGym branch and our consultants will help you choose the right package. Alternatively, you can buy online and activate it at the nearest branch.',
    },
    {
      q: 'Can I train at a different branch from my initial registration place?',
      a: 'Yes. With the EnerGym All Access package, you can train at any branch across the EnerGym network nationwide without re-registering. If you are on the Standard package, please check the list of applicable branches before visiting.',
    },
    {
      q: 'Are the facilities and equipment the same at all branches?',
      a: 'Basically, all EnerGym fitness centers are fully equipped with tools and facilities, featuring distinct training areas. However, each center has its own unique design layout to meet different customer needs and create fresh, non-repetitive experiences.',
    },
  ]
};

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const { locale } = useLanguage();
  const currentFaqs = faqs[locale] || faqs.vi;

  return (
    <section className="w-full bg-[#d9d9d9]">
      <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
        <div className="rounded-lg bg-[#d9d9d9] px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-16">
          <h2 className="mb-10 text-2xl font-bold tracking-wide text-gray-900 uppercase md:text-3xl lg:text-4xl">
            {locale === 'vi' ? 'CÁC CÂU HỎI THƯỜNG GẶP (FAQ)' : 'FREQUENTLY ASKED QUESTIONS (FAQ)'}
          </h2>

          <div className="space-y-8 lg:space-y-10">
            {currentFaqs.map((item, index) => {
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
