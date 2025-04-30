import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ImageSliderProps = {
  images: string[];
  onRemove: (index: number) => void;
};

export const ImageSlider = ({ images, onRemove }: ImageSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative w-full h-[300px] bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-xl overflow-hidden">
      <div className="absolute top-4 right-4 z-10">
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onRemove(currentIndex)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div
        className="w-full h-full bg-center bg-cover duration-500"
        style={{ backgroundImage: `url(${images[currentIndex]})` }}
      />

      {images.length > 1 && (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 bg-opacity-50 backdrop-blur-md"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-800 bg-opacity-50 backdrop-blur-md"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  currentIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
