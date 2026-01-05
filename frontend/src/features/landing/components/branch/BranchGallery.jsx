import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const galleryImages = [
  'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

export default function BranchGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <section className="py-16 transition-colors" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-2xl">
          <div className="relative aspect-[16/9]">
            <img
              src={galleryImages[currentIndex]}
              alt={`Gym view ${currentIndex + 1}`}
              className="h-full w-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full p-3 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:scale-110"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>

            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-3 opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:scale-110"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8' : ''
                  }`}
                  style={{
                    backgroundColor:
                      index === currentIndex ? 'var(--brand)' : 'rgba(255, 255, 255, 0.5)',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="absolute bottom-6 left-6 text-white">
            <p className="mb-1 text-sm font-medium">8+</p>
            <p className="text-xs opacity-80">Thiết bị hiện đại</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {galleryImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-video overflow-hidden rounded-lg transition-all hover:scale-105 ${
                index === currentIndex ? 'ring-4' : ''
              }`}
              style={{ ringColor: index === currentIndex ? 'var(--brand)' : 'transparent' }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
