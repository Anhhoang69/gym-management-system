import { ChevronLeft, ChevronRight, Award, Calendar } from 'lucide-react';
import { useState } from 'react';

const trainers = [
  {
    name: 'Hoàng Anh Minh',
    specialty: 'Giảm mỡ, tăng cơ',
    experience: '6 năm',
    image:
      'https://images.pexels.com/photos/3490295/pexels-photo-3490295.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Hoàng Ngọc Anh',
    specialty: 'Giảm mỡ, tăng cơ',
    experience: '6 năm',
    image:
      'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Lê Văn Tuấn',
    specialty: 'Giảm mỡ, tăng cơ',
    experience: '6 năm',
    image:
      'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    name: 'Lê Hoàng Anh',
    specialty: 'Giảm mỡ, tăng cơ',
    experience: '6 năm',
    image:
      'https://images.pexels.com/photos/3775566/pexels-photo-3775566.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
];

export default function BranchPT() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const scroll = (direction) => {
    const container = document.getElementById('trainers-container');
    const scrollAmount = 320;
    const newPosition =
      direction === 'left'
        ? Math.max(0, scrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, scrollPosition + scrollAmount);

    container.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  return (
    <section
      id="trainers"
      className="py-20 transition-colors"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2
          className="mb-16 text-center text-4xl font-bold lg:text-5xl"
          style={{ color: 'var(--text-primary)' }}
        >
          ĐỘI NGŨ PT
        </h2>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute top-1/2 left-0 z-10 hidden -translate-x-4 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all hover:scale-110 md:block"
            style={{ backgroundColor: 'var(--brand)', color: 'var(--on-brand)' }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            id="trainers-container"
            className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trainers.map((trainer, index) => (
              <div key={index} className="group w-72 flex-shrink-0">
                <div
                  className="overflow-hidden rounded-2xl transition-all hover:shadow-2xl"
                  style={{ backgroundColor: 'var(--bg-third)', border: '1px solid var(--border)' }}
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-4 text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {trainer.name}
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          <Award className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Chuyên môn
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {trainer.specialty}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{ backgroundColor: 'var(--surface)' }}
                        >
                          <Calendar className="h-4 w-4" style={{ color: 'var(--brand)' }} />
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            Kinh nghiệm
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {trainer.experience}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute top-1/2 right-0 z-10 hidden translate-x-4 -translate-y-1/2 rounded-full p-3 shadow-lg transition-all hover:scale-110 md:block"
            style={{ backgroundColor: 'var(--brand)', color: 'var(--on-brand)' }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
