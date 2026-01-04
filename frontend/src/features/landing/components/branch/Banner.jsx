import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';

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
  const wrapperRef = useRef(null);

  // 👉 Click ra ngoài thì đóng dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  return (
    <div className="relative h-[520px] w-full">
      <img src={image} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-6 md:px-16 md:pb-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="mb-4 flex w-full flex-col space-y-4 text-center md:mb-0 md:w-2/3 md:space-y-6 md:text-left">
            <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
            <p className="text-lg text-gray-200 md:text-2xl">{subtitle}</p>
          </div>

          {/* Search box */}
          <div ref={wrapperRef} className="relative w-full md:w-[420px]">
            <div className="flex items-center gap-3 rounded-xl bg-white/95 px-5 py-4 shadow-xl ring-1 ring-black/10 backdrop-blur transition focus-within:ring-2 focus-within:ring-(--brand)">
              <Search className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm chi nhánh gần bạn..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-transparent text-base text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && (
              <ul className="absolute z-50 mt-2 max-h-64 w-full overflow-auto rounded-xl bg-white shadow-2xl ring-1 ring-black/10">
                {filteredBranches.length > 0 ? (
                  filteredBranches.map((b, i) => (
                    <li
                      key={i}
                      onClick={() => handleSelect(b.city)}
                      className="cursor-pointer px-5 py-3 text-gray-800 transition hover:bg-(--brand)/10 hover:text-black"
                    >
                      {b.city}
                    </li>
                  ))
                ) : (
                  <li className="px-5 py-3 text-sm text-gray-400">Không tìm thấy chi nhánh</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
