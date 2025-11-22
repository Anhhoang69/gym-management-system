export default function Banner({
  title,
  subtitle,
  image,
  search,
  setSearch,
  showDropdown,
  setShowDropdown,
  filteredBranches,
  handleSelect,
}) {
  return (
    <div className="relative h-[500px] w-full">
      <img src={image} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

      <div className="absolute right-0 bottom-0 left-0 flex flex-col items-center justify-between px-4 pb-4 md:flex-row md:px-16 md:pb-8">
        <div className="mb-4 flex w-full flex-col space-y-4 text-center md:mb-0 md:w-1/2 md:space-y-6 md:text-left">
          <h1 className="text-4xl font-bold text-white md:text-5xl">{title}</h1>
          <p className="text-lg text-gray-200">{subtitle}</p>
        </div>

        <div className="w-full md:w-auto">
          <div className="relative w-64 md:w-64">
            <input
              type="text"
              placeholder="Tìm chi nhánh..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
            {showDropdown && filteredBranches.length > 0 && (
              <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-300 bg-white shadow-lg">
                {filteredBranches.map((b, i) => (
                  <li
                    key={i}
                    className="cursor-pointer px-4 py-2 text-gray-800 hover:bg-yellow-100 hover:text-black"
                    onClick={() => handleSelect(b.city)}
                  >
                    {b.city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
