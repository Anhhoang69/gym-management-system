import React, { useState } from 'react';
import Banner from '../components/Banner'; // import đúng file Banner.jsx
import { Link } from 'react-router-dom';

const branches = [
  { city: 'Hà Nội', link: '/branches/hanoi', img: '/images/branch-hanoi.jpg' },
  { city: 'Đà Nẵng', link: '/branches/danang', img: '/images/branch-danang.jpg' },
  { city: 'Hồ Chí Minh', link: '/branches/hcm', img: '/images/branch-hcm.jpg' },
  { city: 'Cần Thơ', link: '/branches/cantho', img: '/images/branch-cantho.jpg' },
];

export default function BranchesPage() {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredBranches = branches.filter((b) =>
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (city) => {
    setSearch(city);
    setShowDropdown(false);
  };

  return (
    <div className="w-full text-white" style={{ backgroundColor: 'var(--color-primary-dark)' }}>
      <Banner
        title="30+ CHI NHÁNH"
        subtitle="Chọn chi nhánh gần bạn nhất và bắt đầu hành trình tập luyện hôm nay."
        image="/images/branch-banner.jpg"
        search={search}
        setSearch={setSearch}
        showDropdown={showDropdown}
        setShowDropdown={setShowDropdown}
        filteredBranches={filteredBranches}
        handleSelect={handleSelect}
      />

      {/* Branch List */}
      <div className="w-full space-y-4 p-4">
        {branches.map((b, i) => (
          <div key={i} className="w-full rounded-xl bg-black">
            <div className="container mx-auto grid items-center gap-10 px-6 py-10 md:grid-cols-2">
              <div>
                <h2 className="text-3xl font-bold">{b.city}</h2>
                <Link
                  to={b.link}
                  className="mt-4 inline-block text-lg underline"
                  style={{ color: 'var(--color-yellow)' }}
                >
                  Xem phòng tập tại Thành phố {b.city}
                </Link>
              </div>

              <div>
                <img
                  src={b.img}
                  alt={b.city}
                  className="h-[330px] w-full rounded-xl object-cover shadow-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
