import React from 'react';
import { useParams, Link } from 'react-router-dom';

const branches = [
  { city: 'hanoi', name: 'Hà Nội', address: '123 Phố A, Hà Nội', img: '/images/branch-hanoi.jpg' },
  {
    city: 'danang',
    name: 'Đà Nẵng',
    address: '456 Phố B, Đà Nẵng',
    img: '/images/branch-danang.jpg',
  },
  { city: 'hcm', name: 'Hồ Chí Minh', address: '789 Phố C, TP.HCM', img: '/images/branch-hcm.jpg' },
  {
    city: 'cantho',
    name: 'Cần Thơ',
    address: '101 Phố D, Cần Thơ',
    img: '/images/branch-cantho.jpg',
  },
];

export default function BranchDetailPage() {
  const { city } = useParams(); // lấy param :city từ URL
  const branch = branches.find((b) => b.city === city);

  if (!branch) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">Chi nhánh không tồn tại</h1>
        <Link to="/branches" className="mt-4 inline-block text-yellow-500 underline">
          Quay lại danh sách chi nhánh
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="relative h-[400px] w-full">
        <img src={branch.img} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute bottom-8 left-8">
          <h1 className="text-4xl font-bold">{branch.name}</h1>
          <p className="mt-2 text-lg">{branch.address}</p>
        </div>
      </div>

      <div className="container mx-auto p-8">
        <h2 className="mb-4 text-2xl font-bold">Thông tin chi nhánh</h2>
        <p>
          Chi nhánh {branch.name} cung cấp đầy đủ các dịch vụ phòng tập, huấn luyện viên chuyên
          nghiệp và trang thiết bị hiện đại.
        </p>
        {/* Bạn có thể thêm lịch, map, form đăng ký,... */}
      </div>
    </div>
  );
}
