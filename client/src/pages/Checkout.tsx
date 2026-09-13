import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/services/orders";
import { fetchSettings } from "@/services/auth";
import type { Settings } from "@/types";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<Settings | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((data) => setSettings(data ?? null))
      .catch(() => setSettings(null));
  }, []);

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const order = await createOrder({
        customer: { name, phone, email: email || undefined, location },
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          colour: item.colour,
          qty: item.qty,
        })),
      });

      clearCart();
      navigate(`/order-success/${order.receiptNumber}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not place your order";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-brand-muted">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Checkout</h1>

      <div className="mt-6 rounded-xl border border-brand-border bg-brand-surface p-4">
        <div className="flex items-center justify-between text-sm text-brand-muted">
          <span>{items.reduce((sum, i) => sum + i.qty, 0)} items</span>
          <span>{formatKes(subtotal)}</span>
        </div>
      </div>

      {settings?.mpesaTillNumber && (
        <div className="clay-surface mt-6 p-5">
          <p className="text-sm font-semibold text-brand-crimson">Pay via M-Pesa Buy Goods</p>
          <p className="mt-2 text-sm text-white">
            Till: <span className="mono-ref">{settings.mpesaTillNumber}</span> ({settings.mpesaTillName})
          </p>
          <p className="mt-2 text-sm text-brand-muted">
            Complete payment then place your order below. We will confirm your payment and send your
            receipt on WhatsApp.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input
          placeholder="M-Pesa phone number (07XXXXXXXX)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <Input
          type="email"
          placeholder="Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="Delivery location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        {error && <p className="text-sm text-brand-crimson">{error}</p>}

        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Placing order..." : "Place Order"}
        </Button>
      </form>
    </div>
  );
}
