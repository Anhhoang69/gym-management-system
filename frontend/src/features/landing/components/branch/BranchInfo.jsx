export default function BranchInfo() {
  const info = [
    { label: 'Địa chỉ', value: '25 Nguyễn Thị Minh Khai, Q.1, TP.HCM' },
    { label: 'Giờ mở cửa', value: '5:00 – 22:00 (T2 – CN)' },
    { label: 'Hotline', value: '0901 234 567' },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid gap-6 md:grid-cols-3">
        {info.map((i, idx) => (
          <div key={idx} className="rounded-2xl border border-(--border) bg-(--surface) p-6">
            <p className="text-sm text-(--text-secondary)">{i.label}</p>
            <p className="mt-2 font-semibold">{i.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
