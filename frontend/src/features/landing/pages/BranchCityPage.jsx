import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Banner from '../components/branch/Banner';
import FAQSection from '../components/branch/FAQSection';

const branchDetails = {
  hcm: [
    {
      name: 'EnerGym Quận 1',
      address: '72 Lê Thánh Tôn, P. Bến Nghé, Quận 1, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
      slug: 'quan-1',
    },
    {
      name: 'EnerGym Bình Thạnh',
      address: '72 Lê Thánh Tôn, Bình Thạnh, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
    },
    {
      name: 'EnerGym Làng Đại Học',
      address: 'Khu ĐHQG, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
    },
    {
      name: 'EnerGym Thủ Đức',
      address: 'Linh Trung, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
    },
  ],
};

const ITEMS_PER_PAGE = 2;

export default function BranchCityPage() {
  const { city } = useParams();
  const branches = branchDetails[city] || [];

  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef(null);

  const totalPages = Math.ceil(branches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBranches = branches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  /* Scroll lên đầu list khi đổi page */
  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  /* Reset page khi đổi city */
  useEffect(() => {
    setCurrentPage(1);
  }, [city]);

  return (
    <div className="w-full bg-(--bg) text-(--text-primary)">
      {/* ===== Banner ===== */}
      <Banner
        title={`Chi nhánh EnerGym tại ${city.toUpperCase()}`}
        subtitle="Chọn phòng tập phù hợp với bạn và bắt đầu hành trình tập luyện hôm nay"
        image="/images/branch-banner.jpg"
      />

      {/* ===== Branch List ===== */}
      <div ref={listRef} className="w-full space-y-8 px-4 py-10 sm:px-6 lg:px-10">
        {/* EMPTY STATE */}
        {branches.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--bg-secondary) px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">Hiện chưa có chi nhánh tại khu vực này</h2>

            <p className="mt-3 max-w-md text-(--text-secondary)">
              EnerGym đang mở rộng hệ thống. Hãy quay lại sau hoặc đăng ký để nhận thông báo khi có
              chi nhánh mới.
            </p>

            <div className="mt-6 flex gap-4">
              <Link to="/branches" className="text-(--brand) underline underline-offset-4">
                Xem các thành phố khác
              </Link>

              <Link
                to="/contact"
                className="rounded-md bg-(--brand) px-5 py-2 font-semibold text-black"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        )}

        {/* BRANCH CARDS */}
        {currentBranches.map((b, i) => (
          <div key={i} className="w-full rounded-2xl border border-(--border) bg-(--bg-secondary)">
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-2 lg:gap-14 lg:px-10">
              {/* CONTENT */}
              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{b.name}</h2>

                <p className="text-(--text-secondary)">{b.address}</p>

                <p className="text-sm">
                  <span className="font-semibold">Giờ mở cửa:</span> {b.time}
                </p>

                <p className="text-sm">
                  <span className="font-semibold">Hotline:</span> {b.phone}
                </p>

                <div className="mt-5 flex flex-wrap gap-4">
                  <Link
                    to={`/branches/${city}/${b.slug}`}
                    className="text-sm font-medium text-(--brand) underline underline-offset-4"
                  >
                    Xem chi tiết →
                  </Link>

                  <Link
                    to="/register"
                    className="rounded-md bg-(--brand) px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                  >
                    Đăng ký tập thử
                  </Link>
                </div>
              </div>

              {/* IMAGE */}
              <img
                src={b.img}
                alt={b.name}
                className="h-[220px] w-full rounded-xl object-cover shadow-lg sm:h-[280px] lg:h-[320px]"
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-12">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 text-sm disabled:opacity-40"
          >
            ← Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === i + 1 ? 'bg-(--brand) text-black' : 'hover:bg-(--hover)'
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 text-sm disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      <FAQSection />
    </div>
  );
}
