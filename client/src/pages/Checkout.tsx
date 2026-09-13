import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCart } from "@/context/CartContext";
import { createOrder, trackOrderByReceipt } from "@/services/orders";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

type CheckoutStage = "form" | "awaiting_payment" | "failed";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [stage, setStage] = useState<CheckoutStage>("form");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function pollForPayment(receiptNumber: string): Promise<void> {
    const maxAttempts = 20;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      try {
        const order = await trackOrderByReceipt(receiptNumber);

        if (order.paymentStatus === "paid") {
          clearCart();
          navigate(`/order-success/${receiptNumber}`);
          return;
        }

        if (order.paymentStatus === "failed") {
          setStage("failed");
          return;
        }
      } catch {
        // keep polling
      }
    }

    setStage("failed");
    setError("We have not received your payment confirmation yet. Check Track Order shortly.");
  }

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

      setStage("awaiting_payment");
      void pollForPayment(order.receiptNumber);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not place your order";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0 && stage === "form") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-brand-muted">Your cart is empty.</p>
      </div>
    );
  }

  if (stage === "awaiting_payment") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-white">Check your phone</h1>
        <p className="mt-4 text-brand-muted">
          We sent an M-Pesa STK push to {phone}. Enter your PIN to complete payment.
        </p>
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-brand-border">
          <div className="h-full w-1/3 animate-pulse bg-brand-crimson" />
        </div>
      </div>
    );
  }

  if (stage === "failed") {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-white">Payment not confirmed</h1>
        <p className="mt-4 text-brand-muted">{error || "The payment could not be completed."}</p>
        <Button onClick={() => setStage("form")} className="mt-8">
          Try Again
        </Button>
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
          {submitting ? "Placing order..." : "Pay with M-Pesa"}
        </Button>
      </form>
    </div>
  );
}
