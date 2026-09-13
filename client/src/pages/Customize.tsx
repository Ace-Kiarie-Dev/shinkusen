const PLACEMENT_ZONES = ["Left Chest", "Center Chest", "Full Back", "Left Sleeve"];

export default function Customize() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24 text-center">
      <p className="text-brand-crimson text-sm font-semibold tracking-widest">COMING SOON</p>
      <h1 className="font-display mt-3 text-5xl text-white">Customize Your Own</h1>
      <p className="mx-auto mt-4 max-w-lg text-brand-muted">
        Soon you will be able to design your own SHINKUSEN piece, choose your garment, and place
        your artwork exactly where you want it.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {PLACEMENT_ZONES.map((zone) => (
          <div
            key={zone}
            className="clay-surface flex cursor-not-allowed items-center justify-center p-10 opacity-50"
          >
            <span className="font-display text-lg text-white">{zone}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
