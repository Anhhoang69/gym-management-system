import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import FAQItem from './FAQItem';

const faqData = [
  {
    id: 1,
    category: 'Gói tập & Thanh toán',
    question: 'Tôi có thể đổi gói tập khi đã đăng ký gói khác hay không?',
    answer:
      'Có, bạn hoàn toàn có thể nâng cấp hoặc thay đổi gói tập của mình bất cứ lúc nào. Chúng tôi sẽ tính toán phí chênh lệch và áp dụng cho thời gian còn lại của gói hiện tại.',
  },
  {
    id: 2,
    category: 'Gói tập & Thanh toán',
    question: 'Tôi có thể đình chỉ hoặc hủy gói đăng ký sau khi đăng ký hay không?',
    answer:
      'Bạn có thể đình chỉ gói tập tối đa 2 tháng/năm với lý do hợp lý. Để hủy gói, vui lòng thông báo trước 30 ngày và hoàn tất các thủ tục tại chi nhánh.',
  },
  {
    id: 3,
    category: 'Gói tập & Thanh toán',
    question: 'EnerGym có những hình thức thanh toán nào?',
    answer:
      'Chúng tôi chấp nhận thanh toán qua tiền mặt, chuyển khoản ngân hàng, thẻ tín dụng/ghi nợ, ví điện tử (Momo, ZaloPay), và trả góp qua thẻ tín dụng.',
  },
  {
    id: 4,
    category: 'Gói tập & Thanh toán',
    question: 'Có chương trình ưu đãi nào cho sinh viên hoặc nhóm không?',
    answer:
      'Có, sinh viên được giảm 15% khi xuất trình thẻ sinh viên hợp lệ. Đăng ký nhóm từ 3 người trở lên được giảm 20%. Các chương trình ưu đãi có thể thay đổi theo thời điểm.',
  },
  {
    id: 5,
    category: 'Cơ sở vật chất',
    question: 'Trang thiết bị tại các chi nhánh có giống nhau hay khác nhau?',
    answer:
      'Tất cả chi nhánh đều được trang bị đầy đủ thiết bị cơ bản. Một số chi nhánh premium có thêm khu vực spa, sauna, và các thiết bị chuyên biệt. Bạn có thể xem chi tiết trên trang Chi nhánh.',
  },
];

const ITEMS_PER_PAGE = 5;

export default function FAQList({ searchQuery, activeFilter }) {
  const [currentPage, setCurrentPage] = useState(1);

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Tất cả' || faq.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredFAQs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedFAQs = filteredFAQs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 pb-16">
      <div className="mb-8 space-y-4">
        {paginatedFAQs.map((faq) => (
          <FAQItem
            key={faq.id}
            category={faq.category}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-lg p-2 transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className="h-10 w-10 rounded-lg font-medium transition-all hover:scale-110"
              style={{
                backgroundColor: currentPage === page ? 'var(--brand)' : 'var(--bg-third)',
                color: currentPage === page ? 'var(--on-brand)' : 'var(--text-primary)',
                border: `1px solid ${currentPage === page ? 'var(--brand)' : 'var(--border)'}`,
              }}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-lg p-2 transition-all hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
            style={{ color: 'var(--text-secondary)' }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
