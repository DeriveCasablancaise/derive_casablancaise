import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AdminButton } from './admin-ui';
import { CreditInput } from './CreditInput';

type ImageSliderProps = {
  images: string[];
  onRemove: (index: number) => void;
  onMove?: (from: number, to: number) => void;
  onRecrop?: (index: number) => void;
  // credit of the image shown, shown only when onCreditChange is given
  creditFor?: (url: string) => string;
  onCreditChange?: (url: string, credit: string) => void;
};

export const ImageSlider = ({
  images,
  onRemove,
  onMove,
  onRecrop,
  creditFor,
  onCreditChange,
}: ImageSliderProps) => {
  const [selectedIndex, setCurrentIndex] = useState(0);
  // removing the last image would otherwise leave the index past the end
  const currentIndex = Math.min(selectedIndex, images.length - 1);
  const currentImage = images[currentIndex];
  // a blob is a new image, it already went through the cropper
  const canRecrop =
    onRecrop && currentImage && !currentImage.startsWith('blob:');

  const move = (offset: number) => {
    const target = currentIndex + offset;
    if (!onMove || target < 0 || target >= images.length) return;
    onMove(currentIndex, target);
    setCurrentIndex(target);
  };

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
    <div className="admin-preview">
      <div className="admin-preview-bar">
        {images.length > 1 && (
          <>
            <AdminButton
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Image précédente"
              title="Image précédente"
              onClick={goToPrevious}
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </AdminButton>
            <span className="text-sm tabular-nums" aria-live="polite">
              {currentIndex + 1} / {images.length}
            </span>
            <AdminButton
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Image suivante"
              title="Image suivante"
              onClick={goToNext}
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </AdminButton>
          </>
        )}

        <div className="ms-auto flex flex-wrap items-center gap-2">
          {onMove && images.length > 1 && (
            <>
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => move(-1)}
              >
                Avancer
              </AdminButton>
              <AdminButton
                type="button"
                variant="secondary"
                size="sm"
                disabled={currentIndex === images.length - 1}
                onClick={() => move(1)}
              >
                Reculer
              </AdminButton>
            </>
          )}
          {canRecrop && (
            <AdminButton
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onRecrop?.(currentIndex)}
            >
              Recadrer
            </AdminButton>
          )}
          <AdminButton
            type="button"
            variant="danger"
            size="sm"
            onClick={() => onRemove(currentIndex)}
          >
            Supprimer
          </AdminButton>
        </div>
      </div>

      <img
        src={currentImage}
        alt={`Aperçu de l'image ${currentIndex + 1} sur ${images.length}`}
        className="admin-preview-image"
      />
      {onCreditChange && currentImage && (
        <CreditInput
          value={creditFor?.(currentImage) ?? ''}
          onChange={(credit) => onCreditChange(currentImage, credit)}
        />
      )}
    </div>
  );
};
