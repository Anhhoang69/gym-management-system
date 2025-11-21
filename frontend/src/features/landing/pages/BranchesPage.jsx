import React from 'react';

const branches = [
  {
    city: 'Hà Nội',
    link: '/branches/hanoi',
    img: '/images/branch-hanoi.jpg',
  },
  {
    city: 'Đà Nẵng',
    link: '/branches/danang',
    img: '/images/branch-danang.jpg',
  },
  {
    city: 'Hồ Chí Minh',
    link: '/branches/hcm',
    img: '/images/branch-hcm.jpg',
  },
  {
    city: 'Cần Thơ',
    link: '/branches/cantho',
    img: '/images/branch-cantho.jpg',
  },
];

export default function BranchesPage() {
  return (
    <div className="w-full bg-black text-white">
      {/* Banner */}
      <div className="relative h-[420px] w-full">
        <img src="/images/branch-banner.jpg" className="h-full w-full object-cover brightness-75" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">30+ CHI NHÁNH</h1>
          <p className="mt-4 max-w-[700px] text-lg text-gray-200">
            Chọn chi nhánh gần bạn nhất và bắt đầu hành trình tập luyện hôm nay.
          </p>
        </div>
      </div>

      {/* Branch list */}
      <div className="mx-auto max-w-6xl space-y-24 px-4 py-16">
        {branches.map((b, i) => (
          <div key={i} className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">{b.city}</h2>
              <a href={b.link} className="mt-4 inline-block text-lg text-yellow-400 underline">
                Xem phòng tập tại Thành phố {b.city}
              </a>
            </div>

            <img
              src={b.img}
              alt={b.city}
              className="h-[330px] w-full rounded-xl object-cover shadow-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
