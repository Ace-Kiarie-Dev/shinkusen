import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE")}`;
}

export default function Cart() {
  const { items, removeItem, updateQty, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-white">Your cart is empty</h1>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-white">Your Cart</h1>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}-${item.colour}`}
            className="flex items-center gap-4 rounded-xl border border-brand-border bg-brand-surface p-4"
          >
            <div className="h-20 w-20 overflow-hidden rounded-lg bg-brand-black">
              {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover" />}
            </div>

            <div className="flex-1">
              <p className="font-medium text-white">{item.title}</p>
              <p className="text-xs text-brand-muted">
                {item.size} {item.colour && `/ ${item.colour}`}
              </p>
              <p className="mt-1 text-sm text-brand-crimson">{formatKes(item.unitPrice)}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQty(item.productId, item.size, item.colour, item.qty - 1)}
                className="h-8 w-8 rounded-full border border-brand-border text-white"
              >
                &minus;
              </button>
              <span className="w-6 text-center text-white">{item.qty}</span>
              <button
                onClick={() => updateQty(item.productId, item.size, item.colour, item.qty + 1)}
                className="h-8 w-8 rounded-full border border-brand-border text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.productId, item.size, item.colour)}
              className="text-xs text-brand-muted hover:text-brand-crimson"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-brand-border pt-6">
        <p className="text-lg font-semibold text-white">Subtotal</p>
        <p className="text-lg font-semibold text-brand-crimson">{formatKes(subtotal)}</p>
      </div>
      <p className="mt-1 text-xs text-brand-muted">Shipping is calculated at checkout.</p>

      <Button onClick={() => navigate("/checkout")} className="mt-6 w-full">
        Proceed to Checkout
      </Button>
    </div>
  );
}
