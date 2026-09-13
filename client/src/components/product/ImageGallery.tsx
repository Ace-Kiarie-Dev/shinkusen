import { useState } from "react";

export default function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-xl border border-brand-border bg-brand-surface">
        {active ? (
          <img src={active} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-muted">No image</div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              onClick={() => setActiveIndex(index)}
              className={`h-16 w-16 overflow-hidden rounded-lg border-2 transition-colors ${
                index === activeIndex ? "border-brand-crimson" : "border-brand-border"
              }`}
            >
              <img src={image} alt={`${title} ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
