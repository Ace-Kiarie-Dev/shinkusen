import Modal from "@/components/ui/Modal";

const SIZE_ROWS = [
  { size: "S", chest: "48", length: "68" },
  { size: "M", chest: "51", length: "70" },
  { size: "L", chest: "54", length: "72" },
  { size: "XL", chest: "57", length: "74" },
  { size: "XXL", chest: "60", length: "76" },
];

export default function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Size Guide">
      <p className="mb-4 text-sm text-brand-muted">All measurements are in centimetres, laid flat.</p>
      <table className="w-full text-left text-sm text-white">
        <thead>
          <tr className="border-b border-brand-border text-brand-muted">
            <th className="py-2">Size</th>
            <th className="py-2">Chest</th>
            <th className="py-2">Length</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_ROWS.map((row) => (
            <tr key={row.size} className="border-b border-brand-border/50">
              <td className="py-2 font-semibold">{row.size}</td>
              <td className="py-2">{row.chest}</td>
              <td className="py-2">{row.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}
