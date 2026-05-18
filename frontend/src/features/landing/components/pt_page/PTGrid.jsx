import pt1 from "../../../../assets/pt-1.jpg";
import pt2 from "../../../../assets/pt-2.jpg";
import pt3 from "../../../../assets/pt-3.jpg";
import pt4 from "../../../../assets/pt-4.jpg";

import { useState } from "react";
import PTCard from "./PTCard";
import PTModal from "./PTModal";

export default function PTGrid() {
  const trainers = [
    { image: pt1, name: "Hoàng Anh Minh", specialty: "Giảm mỡ, tăng cơ", experience: "6 năm" },
    { image: pt2, name: "Hoàng Ngọc Anh", specialty: "Giảm mỡ", experience: "5 năm" },
    { image: pt3, name: "Lê Văn Tuấn", specialty: "Giảm mỡ, tăng cơ", experience: "6 năm" },
    { image: pt4, name: "Lê Hoàng Anh", specialty: "Tăng cơ, thể hình", experience: "4 năm" },

    { image: pt1, name: "Nguyễn Minh Khoa", specialty: "Giảm mỡ, phục hồi thể lực", experience: "7 năm" },
    { image: pt2, name: "Trần Ngọc Bảo", specialty: "Giảm mỡ", experience: "5 năm" },
    { image: pt3, name: "Phạm Quốc Huy", specialty: "Tăng cơ, sức mạnh", experience: "8 năm" },
    { image: pt4, name: "Võ Thanh Châu", specialty: "Thể hình, sức mạnh", experience: "6 năm" },

    { image: pt1, name: "Đặng Anh Duy", specialty: "Giảm mỡ, tăng cơ", experience: "5 năm" },
    { image: pt2, name: "Bùi Thị Mai Anh", specialty: "Giảm mỡ, fitness nữ", experience: "4 năm" },
    { image: pt3, name: "Nguyễn Văn Phúc", specialty: "Tăng cơ, bodybuilding", experience: "9 năm" },
    { image: pt4, name: "Lê Quốc Khánh", specialty: "Sức mạnh, powerlifting", experience: "7 năm" },

    { image: pt1, name: "Phan Minh Trí", specialty: "Giảm mỡ", experience: "4 năm" },
    { image: pt2, name: "Huỳnh Ngọc Yến", specialty: "Fitness, giảm mỡ", experience: "5 năm" },
    { image: pt3, name: "Trần Đức Long", specialty: "Tăng cơ, thể hình", experience: "8 năm" },
    { image: pt4, name: "Nguyễn Hoàng Phát", specialty: "Giảm mỡ, tăng cơ", experience: "6 năm" },

    { image: pt1, name: "Lý Minh Quân", specialty: "Thể lực tổng quát", experience: "5 năm" },
    { image: pt2, name: "Đoàn Thị Thu Trang", specialty: "Fitness nữ, giảm mỡ", experience: "4 năm" },
    { image: pt3, name: "Vũ Quốc Bảo", specialty: "Tăng cơ, sức mạnh", experience: "7 năm" },
    { image: pt4, name: "Ngô Thanh Sơn", specialty: "Thể hình, sức mạnh", experience: "6 năm" },
  ];

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(trainers.length / ITEMS_PER_PAGE);

  const [page, setPage] = useState(1);

  // 🔥 STATE CHO MODAL
  const [selectedPT, setSelectedPT] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = trainers.slice(start, start + ITEMS_PER_PAGE);

  return (
    <section className="bg-[var(--bg)] py-20 relative">
      {/* DECORATIVE BACKGROUND ELEMENTS */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[var(--brand)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand)]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

      {/* INTRO */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-6">
          Chuyên Gia Của <span className="text-[var(--brand)]">Chúng Tôi</span>
        </h2>
        <p className="block text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
          Đội ngũ Huấn luyện viên của chúng tôi gồm những chuyên gia được chứng nhận
          quốc tế, có nhiều năm kinh nghiệm trong lĩnh vực thể hình và sức khỏe.
          Sẵn sàng đồng hành cùng bạn trên mọi hành trình.
        </p>
        <div className="w-24 h-1 bg-[var(--brand)] mx-auto mt-8 rounded-full"></div>
      </div>

      {/* GRID */}
      <div
        className="
          relative z-10
          mt-16
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          gap-8
          px-6
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {currentItems.map((pt, index) => (
          <PTCard
            key={index}
            {...pt}
            onClick={() => {
              setSelectedPT(pt);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="relative z-10 mt-16 flex justify-center gap-4">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNumber = i + 1;
            const isActive = page === pageNumber;

            return (
              <button
                key={pageNumber}
                onClick={() => setPage(pageNumber)}
                className={`
                   h-12 w-12 rounded-full text-base font-bold transition-all duration-300
                   ${isActive
                    ? "bg-[var(--brand)] text-black shadow-[0_0_15px_rgba(255,193,7,0.5)] -translate-y-1"
                    : "bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-[var(--brand)]/10 hover:text-[var(--brand)] hover:-translate-y-1 border border-[var(--border)]"
                  }
                 `}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && selectedPT && (
        <PTModal
          pt={selectedPT}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
