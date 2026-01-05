import React, { useState, useEffect, useRef } from 'react';
import Banner from '../components/branch/Banner';
import { Link } from 'react-router-dom';
import FAQSection from '../components/branch/FAQSection';
import CTASection from '../components/CTASection';

const branches = [
  { city: 'Hà Nội', link: '/branches/hanoi', img: '/images/branch-hanoi.jpg' },
  { city: 'Đà Nẵng', link: '/branches/danang', img: '/images/branch-danang.jpg' },
  { city: 'Hồ Chí Minh', link: '/branches/hcm', img: '/images/branch-hcm.jpg' },
  { city: 'Cần Thơ', link: '/branches/cantho', img: '/images/branch-cantho.jpg' },
  { city: 'Hà Nội', link: '/branches/hanoi', img: '/images/branch-hanoi.jpg' },
  { city: 'Đà Nẵng', link: '/branches/danang', img: '/images/branch-danang.jpg' },
  { city: 'Hồ Chí Minh', link: '/branches/hcm', img: '/images/branch-hcm.jpg' },
];

const ITEMS_PER_PAGE = 4;

export default function BranchesPage() {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const listRef = useRef(null);

  const filteredBranches = branches.filter((b) =>
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBranches = filteredBranches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    listRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="w-full bg-(--bg) text-(--text-primary)">
      <Banner
        title="30+ CHI NHÁNH"
        subtitle="Chọn chi nhánh gần bạn nhất và bắt đầu hành trình tập luyện hôm nay."
        image="/images/branch-banner.jpg"
        search={search}
        setSearch={setSearch}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        filteredBranches={filteredBranches}
        handleSelect={(city) => {
          setSearch(city);
          setShowDropdown(false);
        }}
      />

      {/* Branch List */}
      <div ref={listRef} className="w-full space-y-8 px-4 pt-10 pb-2 sm:px-6 lg:px-10">
        {currentBranches.map((b, i) => (
          <div
            key={i}
            className="group w-full rounded-2xl border border-(--border) bg-(--bg-secondary) transition-all duration-300 hover:shadow-xl"
          >
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-2 lg:gap-14 lg:px-10">
              {/* CONTENT */}
              <div className="space-y-6">
                <h2 className="text-[2rem] leading-tight font-bold tracking-tight text-(--text-primary) sm:text-[2.4rem] lg:text-[2.8rem]">
                  {b.city}
                </h2>

                <Link
                  to={b.link}
                  className="inline-block text-base font-medium text-(--brand) underline underline-offset-4 transition hover:opacity-80 sm:text-lg"
                >
                  Xem phòng tập tại {b.city} &gt;
                </Link>
              </div>

              {/* IMAGE - Bo góc và hiệu ứng zoom khi hover vào card */}
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={b.img}
                  alt={b.city}
                  className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-[280px] lg:h-[340px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination - Thiết kế mới đồng bộ */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-medium transition hover:text-(--brand) disabled:opacity-30"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-all ${
                  currentPage === i + 1
                    ? 'bg-(--brand) text-black shadow-md'
                    : 'border border-(--border) bg-(--bg-secondary) hover:bg-(--hover)'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-medium transition hover:text-(--brand) disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}

      {/* FAQ + CTA */}
      <FAQSection />
      <CTASection />
    </div>
  );
}
