import type { ProductColour } from "@/types";

interface ColourSwitcherProps {
  colours: ProductColour[];
  selected: string;
  onSelect: (name: string) => void;
}

export default function ColourSwitcher({ colours, selected, onSelect }: ColourSwitcherProps) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-white">
        Colour{selected ? `: ${selected}` : ""}
      </p>
      <div className="flex gap-3">
        {colours.map((colour) => (
          <button
            key={colour.name}
            onClick={() => onSelect(colour.name)}
            title={colour.name}
            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${
              selected === colour.name ? "border-brand-crimson" : "border-brand-border"
            }`}
            style={{ backgroundColor: colour.hex }}
          />
        ))}
      </div>
    </div>
  );
}
