export default function BranchGallery() {
  return (
    <section className="bg-(--bg-secondary) py-14">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-8 text-center text-2xl font-bold">Không gian tập luyện</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <img
              key={i}
              src={`/images/gym-${i}.jpg`}
              className="h-[240px] w-full rounded-xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
