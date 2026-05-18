import { Check, X } from 'lucide-react';

export default function ComparisonTable() {
  const packages = [
    {
      packageId: "744d512c-ce21-4e79-8e4d-d17d6af2b9e7",
      name: "Basic",
      tier: "Basic",
      isPtIncluded: false,
      privatePtLimit: 0,
      groupPtLimit: 0,
      maxCheckinsPerWeek: 7,
      features: [
        "Sử dụng toàn bộ thiết bị tập",
        "Không giới hạn thời gian",
        "Miễn phí gửi xe, tủ đồ"
      ],
    },
    {
      packageId: "1c959d6f-ac5f-4ef6-b7a8-903d60a27175",
      name: "Premium",
      tier: "Premium",
      isPtIncluded: true,
      privatePtLimit: 4,
      groupPtLimit: 4,
      maxCheckinsPerWeek: 7,
      features: [
        "Tất cả quyền lợi Elite",
        "Sử dụng phòng xông hơi",
        "Nước uống, khăn tắm miễn phí"
      ],
    },
    {
      packageId: "2dbf39ff-d4e8-464e-bb85-5fd68f0b19b5",
      name: "Elite",
      tier: "Elite",
      isPtIncluded: true,
      privatePtLimit: 12,
      groupPtLimit: 12,
      maxCheckinsPerWeek: 7,
      features: [
        "Sử dụng toàn bộ thiết bị tập",
        "Không giới hạn thời gian",
        "Miễn phí gửi xe, tủ đồ"
      ],
    }
  ];

  const renderCell = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="mx-auto h-5 w-5" style={{ color: 'var(--brand)' }} />
      ) : (
        <X className="mx-auto h-5 w-5 text-(--text-secondary) opacity-30" />
      );
    }
    return <span className="text-sm text-(--text-secondary)">{value}</span>;
  };

  // Build rows dynamically based on the fetched packages
  const rows = [
    { 
      name: 'Đã bao gồm PT', 
      values: packages.map(pkg => pkg.isPtIncluded)
    },
    { 
      name: 'Giới hạn PT Cá nhân', 
      values: packages.map(pkg => pkg.privatePtLimit > 0 ? `${pkg.privatePtLimit} buổi` : false)
    },
    { 
      name: 'Giới hạn PT Nhóm (Group)', 
      values: packages.map(pkg => pkg.groupPtLimit > 0 ? `${pkg.groupPtLimit} buổi` : false)
    },
    { 
      name: 'Số lượt Check-in / Tuần', 
      values: packages.map(pkg => pkg.maxCheckinsPerWeek >= 7 ? 'Không giới hạn' : `${pkg.maxCheckinsPerWeek} lượt`)
    },
    {
      name: 'Đặc quyền khác',
      values: packages.map(pkg => (
        <ul className="text-sm text-(--text-secondary) list-disc text-left pl-4 space-y-1">
          {pkg.features?.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
      ))
    }
  ];

  return (
    <section
      className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      style={{
        backgroundImage:
          'url(https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 container mx-auto text-center">
        <h2 style={{ color: 'var(--brand)' }} className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight mb-8">
          So Sánh Quyền Lợi
        </h2>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md mt-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-(--bg-secondary)">
                  <th className="px-6 py-4 text-left font-semibold text-(--text-primary)">
                    Tiện ích/ Gói tập
                  </th>
                  {packages.map((pkg) => {
                    const tierColor = pkg.tier ? `var(--plan-${pkg.tier.toLowerCase()})` : 'var(--brand)';
                    return (
                      <th
                        key={pkg.packageId}
                        className="px-6 py-4 text-center font-semibold"
                        style={{ color: tierColor }}
                      >
                        {pkg.name}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-(--bg-third)' : 'bg-(--bg-secondary)'}
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <td className="px-6 py-4 font-medium text-(--text-primary) text-left">{row.name}</td>
                    {row.values.map((val, i) => (
                      <td key={i} className="px-6 py-4 text-center align-top">
                        {typeof val === 'object' && val !== null ? val : renderCell(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
