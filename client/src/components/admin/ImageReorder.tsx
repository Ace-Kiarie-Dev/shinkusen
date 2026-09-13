import { useState } from "react";

interface ImageReorderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageReorder({ images, onChange }: ImageReorderProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(targetIndex: number): void {
    if (dragIndex === null || dragIndex === targetIndex) return;

    const next = [...images];
    const [moved] = next.splice(dragIndex, 1);
    if (moved !== undefined) {
      next.splice(targetIndex, 0, moved);
    }
    onChange(next);
    setDragIndex(null);
  }

  function handleRemove(index: number): void {
    onChange(images.filter((_, i) => i !== index));
  }

  if (images.length === 0) {
    return <p className="text-sm text-brand-muted">No images yet. Upload some below.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {images.map((image, index) => (
        <div
          key={image}
          draggable
          onDragStart={() => setDragIndex(index)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(index)}
          className="relative h-24 w-24 cursor-move overflow-hidden rounded-lg border-2 border-brand-border"
        >
          <img src={image} alt={`Product ${index + 1}`} className="h-full w-full object-cover" />
          {index === 0 && (
            <span className="absolute left-1 top-1 rounded bg-brand-crimson px-1.5 py-0.5 text-[10px] font-bold text-white">
              HERO
            </span>
          )}
          <button
            type="button"
            onClick={() => handleRemove(index)}
            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-xs text-white hover:bg-brand-crimson"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
