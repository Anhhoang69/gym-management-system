export default function BranchPT() {
  const pts = ['Hoàng Anh Minh', 'Hoàng Ngọc Anh', 'Lê Văn Tuấn', 'Lê Hoàng Anh'];

  return (
    <section className="bg-(--bg-secondary) py-14">
      <h2 className="mb-10 text-center text-2xl font-bold">Đội ngũ PT</h2>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4">
        {pts.map((pt, i) => (
          <div
            key={i}
            className="rounded-xl border border-(--border) bg-(--surface) p-4 text-center"
          >
            <img
              src={`/images/pt-${i + 1}.jpg`}
              className="mx-auto h-40 w-full rounded-lg object-cover"
            />
            <p className="mt-4 font-semibold">{pt}</p>
            <p className="text-sm text-(--text-secondary)">Chuyên môn: Giảm mỡ – Tăng cơ</p>
          </div>
        ))}
      </div>
    </section>
  );
}
