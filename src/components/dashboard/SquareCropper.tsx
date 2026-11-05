'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  clampZoom,
  initialCrop,
  MAX_ZOOM,
  MIN_ZOOM,
  panCrop,
  zoomCrop,
} from '@/lib/square-crop';
import {
  CORS_ERROR,
  CropImage,
  exportSquareCrop,
} from '@/lib/square-crop-image';

// internal canvas pixels; the frame leaves a margin to see what gets cut
const STAGE = 600;
const FRAME = 480;
const FRAME_OFFSET = (STAGE - FRAME) / 2;

const ARROW_STEP = 10;
const ZOOM_STEP = 10;

const ARROWS: Record<string, [number, number]> = {
  ArrowLeft: [ARROW_STEP, 0],
  ArrowRight: [-ARROW_STEP, 0],
  ArrowUp: [0, ARROW_STEP],
  ArrowDown: [0, -ARROW_STEP],
};

type SquareCropperProps = {
  image: CropImage;
  fileName: string;
  // can be async; the modal waits for it and shows its error
  onConfirm: (file: File) => void | Promise<void>;
  onCancel: () => void;
};

export function SquareCropper({
  image,
  fileName,
  onConfirm,
  onCancel,
}: SquareCropperProps) {
  const { width, height } = image;
  const [crop, setCrop] = useState(() => initialCrop(width, height));
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');
    if (!context) return;

    const scale = FRAME / crop.size;
    const draw = () =>
      context.drawImage(
        image.source,
        FRAME_OFFSET - crop.x * scale,
        FRAME_OFFSET - crop.y * scale,
        width * scale,
        height * scale,
      );

    context.fillStyle = '#111827';
    context.fillRect(0, 0, STAGE, STAGE);

    context.globalAlpha = 0.35;
    draw();
    context.globalAlpha = 1;

    context.save();
    context.beginPath();
    context.rect(FRAME_OFFSET, FRAME_OFFSET, FRAME, FRAME);
    context.clip();
    draw();
    context.restore();

    context.strokeStyle = '#ffffff';
    context.lineWidth = 2;
    context.strokeRect(FRAME_OFFSET, FRAME_OFFSET, FRAME, FRAME);
  }, [crop, image, width, height]);

  const applyZoom = (next: number) => {
    const clamped = clampZoom(next);
    setZoom(clamped);
    setCrop((current) => zoomCrop(current, clamped, width, height));
  };

  const pan = (dx: number, dy: number) =>
    setCrop((current) => panCrop(current, dx, dy, FRAME, width, height));

  const reset = () => {
    setZoom(MIN_ZOOM);
    setCrop(initialCrop(width, height));
  };

  const onPointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!lastPointer.current) return;

    // the canvas is scaled by CSS, so I bring the move back to stage pixels
    const toStage = STAGE / event.currentTarget.getBoundingClientRect().width;
    pan(
      (event.clientX - lastPointer.current.x) * toStage,
      (event.clientY - lastPointer.current.y) * toStage,
    );
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = () => {
    lastPointer.current = null;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isBusy) return;

    const arrow = ARROWS[event.key];
    // on the slider, arrows keep driving the slider
    if (arrow && (event.target as HTMLElement).tagName !== 'INPUT') {
      event.preventDefault();
      pan(arrow[0], arrow[1]);
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      applyZoom(zoom + ZOOM_STEP);
    } else if (event.key === '-') {
      event.preventDefault();
      applyZoom(zoom - ZOOM_STEP);
    }
  };

  const validate = async () => {
    setIsBusy(true);
    setError(null);

    try {
      await onConfirm(await exportSquareCrop(image, crop, fileName));
    } catch (e) {
      console.error('Square crop failed', e);
      setError(
        e instanceof DOMException && e.name === 'SecurityError'
          ? CORS_ERROR
          : 'Le recadrage a échoué. Veuillez réessayer.',
      );
      setIsBusy(false);
    }
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isBusy) onCancel();
      }}
    >
      <DialogContent
        className="max-h-[95vh] overflow-y-auto"
        onKeyDown={onKeyDown}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>Recadrer l&apos;image</DialogTitle>
        <DialogDescription>
          Faites glisser l&apos;image pour choisir le cadrage. Clavier : flèches
          pour déplacer, + et - pour zoomer, Échap pour annuler.
        </DialogDescription>

        <canvas
          ref={canvasRef}
          width={STAGE}
          height={STAGE}
          role="img"
          aria-label="Aperçu du cadrage"
          className="mx-auto aspect-square w-full max-w-[60vh] cursor-move touch-none rounded-md"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />

        <label className="flex items-center gap-3 text-sm">
          <span>Zoom</span>
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            value={zoom}
            onChange={(event) => applyZoom(Number(event.target.value))}
            className="flex-1"
          />
          <span className="w-12 text-right tabular-nums">{zoom} %</span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={isBusy}
            onClick={reset}
          >
            Réinitialiser
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={onCancel}
          >
            Annuler
          </Button>
          <Button type="button" disabled={isBusy} onClick={validate}>
            {isBusy ? 'Patientez…' : 'Valider'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
