export default function BranchServices() {
  const services = [
    'Phòng tập máy & tạ hiện đại',
    'Functional Training',
    'Huấn luyện viên cá nhân (PT)',
    'Phòng tắm & locker riêng',
    'Quầy nước – protein bar',
    'Wifi & khu lounge',
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="mb-8 text-center text-2xl font-bold">Dịch vụ & tiện ích</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <div key={i} className="rounded-xl border border-(--border) bg-(--surface) p-4">
            ✓ {s}
          </div>
        ))}
      </div>
    </section>
  );
}
