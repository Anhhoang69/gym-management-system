import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiOutlineLocationMarker, HiOutlineClock, HiOutlinePhone } from 'react-icons/hi';
import Banner from '../components/branch/Banner';
import FAQSection from '../components/branch/FAQSection';
import CTASection from '../components/CTASection';
import { useLanguage } from '../../../shared/contexts/LanguageContext';

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
      slug: 'binh-thanh',
    },
    {
      name: 'EnerGym Làng Đại Học',
      address: 'Khu ĐHQG, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
      slug: 'lang-dai-hoc',
    },
    {
      name: 'EnerGym Thủ Đức',
      address: 'Linh Trung, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
      slug: 'thu-duc',
    },
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
      slug: 'binh-thanh',
    },
    {
      name: 'EnerGym Làng Đại Học',
      address: 'Khu ĐHQG, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
      slug: 'lang-dai-hoc',
    },
    {
      name: 'EnerGym Thủ Đức',
      address: 'Linh Trung, Thủ Đức, TP.HCM',
      time: '5:00 – 22:00 T2 - CN',
      phone: '0901 234 567',
      img: '/images/branch-hcm.jpg',
      slug: 'thu-duc',
    },
  ],
};

const ITEMS_PER_PAGE = 4;

export default function BranchCityPage() {
  const { city } = useParams();
  const branches = branchDetails[city] || [];
  const { t } = useLanguage();

  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef(null);

  const totalPages = Math.ceil(branches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentBranches = branches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [city]);

  const getCityTitle = () => {
    if (city?.toLowerCase() === 'hcm') return t('branchesPage.cityHCM');
    if (city?.toLowerCase() === 'hanoi') return t('branchesPage.cityHN');
    if (city?.toLowerCase() === 'danang') return t('branchesPage.cityDN');
    if (city?.toLowerCase() === 'cantho') return t('branchesPage.cityCT');
    return city?.toUpperCase();
  };

  return (
    <div className="w-full bg-(--bg) text-(--text-primary)">
      {/* ===== Banner ===== */}
      <Banner
        title={getCityTitle()}
        subtitle={t('branchesPage.subtitle')}
        image="/images/branch-banner.jpg"
        breadcrumb={[
          { label: t('nav.branches'), to: '/branches' },
          { label: `TP. ${getCityTitle()}` },
        ]}
        showSearch={false}
      />

      {/* ===== Branch List ===== */}
      <div ref={listRef} className="w-full space-y-8 px-4 pt-10 pb-2 sm:px-6 lg:px-10">
        {/* EMPTY STATE */}
        {branches.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-(--border) bg-(--bg-secondary) px-6 py-16 text-center">
            <h2 className="text-2xl font-bold">{t('branchesPage.emptyTitle')}</h2>
            <p className="mt-3 max-w-md text-(--text-secondary)">
              {t('branchesPage.emptyDesc')}
            </p>
            <div className="mt-6 flex gap-4">
              <Link to="/branches" className="text-(--brand) underline underline-offset-4">
                {t('branchesPage.otherCities')}
              </Link>
              <Link
                to="/contact"
                className="rounded-md bg-(--brand) px-5 py-2 font-semibold text-black"
              >
                {t('branchesPage.consultation')}
              </Link>
            </div>
          </div>
        )}

        {/* BRANCH CARDS - Đồng nhất bố cục với trang City */}
        {currentBranches.map((b, i) => (
          <div
            key={i}
            className="group w-full rounded-2xl border border-(--border) bg-(--bg-secondary) transition-all duration-300 hover:shadow-xl"
          >
            <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 sm:py-10 md:grid-cols-2 lg:gap-14 lg:px-10">
              {/* CONTENT - Cỡ chữ đồng nhất [2.8rem] */}
              <div className="space-y-6">
                <h2 className="text-[2rem] leading-tight font-bold tracking-tight sm:text-[2.4rem] lg:text-[2.8rem]">
                  {b.name}
                </h2>

                <div className="space-y-4">
                  {/* Địa chỉ - Link xanh chuyển qua Google Maps */}
                  <div className="flex items-start gap-3">
                    <HiOutlineLocationMarker className="mt-1 shrink-0 text-xl text-(--brand)" />
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base leading-relaxed font-medium text-blue-600 transition-colors hover:text-blue-800 hover:underline sm:text-lg"
                      title="Mở trong Google Maps"
                    >
                      {b.address}
                    </a>
                  </div>

                  {/* Giờ mở cửa */}
                  <div className="flex items-center gap-3">
                    <HiOutlineClock className="shrink-0 text-xl text-(--brand)" />
                    <p className="text-base sm:text-lg">
                      <span className="font-semibold">{t('branchesPage.hoursLabel')}</span> {b.time}
                    </p>
                  </div>

                  {/* Hotline */}
                  <div className="flex items-center gap-3">
                    <HiOutlinePhone className="shrink-0 text-xl text-(--brand)" />
                    <p className="text-base sm:text-lg">
                      <span className="font-semibold">{t('branchesPage.hotlineLabel')}</span> {b.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    to={`/branches/${city}/${b.slug || 'detail'}`}
                    className="text-base font-medium text-(--text-primary) underline underline-offset-4 transition hover:text-(--brand) sm:text-lg"
                  >
                    {t('branchesPage.viewBranch')}
                  </Link>

                  <Link
                    to="/contact"
                    className="rounded-full bg-(--brand) px-10 py-3 text-sm font-bold text-black shadow-md transition-all duration-300 hover:scale-105 hover:bg-yellow-300 active:scale-95"
                  >
                    {t('branchesPage.registerNow')}
                  </Link>
                </div>
              </div>

              {/* IMAGE - Bo góc đồng nhất */}
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={b.img}
                  alt={b.name}
                  className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-[280px] lg:h-[340px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-medium transition hover:text-(--brand) disabled:opacity-30 cursor-pointer"
          >
            {t('branchesPage.prev')}
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`h-10 w-10 rounded-lg text-sm font-bold transition-all cursor-pointer ${
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
            className="px-4 py-2 text-sm font-medium transition hover:text-(--brand) disabled:opacity-30 cursor-pointer"
          >
            {t('branchesPage.next')}
          </button>
        </div>
      )}

      <FAQSection />
      <CTASection />
    </div>
  );
}

