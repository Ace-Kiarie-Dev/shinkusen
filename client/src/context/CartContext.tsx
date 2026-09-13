import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CartItem } from "@/types";

const STORAGE_KEY = "shinkusen_cart";

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string, colour: string) => void;
  updateQty: (productId: string, size: string, colour: string, qty: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function sameLine(a: CartItem, productId: string, size: string, colour: string): boolean {
  return a.productId === productId && a.size === size && a.colour === colour;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => loadCart());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures (private browsing, storage full)
    }
  }, [items]);

  function addItem(item: CartItem): void {
    setItems((prev) => {
      const existing = prev.find((line) => sameLine(line, item.productId, item.size, item.colour));

      if (existing) {
        return prev.map((line) =>
          sameLine(line, item.productId, item.size, item.colour)
            ? { ...line, qty: line.qty + item.qty }
            : line,
        );
      }

      return [...prev, item];
    });
  }

  function removeItem(productId: string, size: string, colour: string): void {
    setItems((prev) => prev.filter((line) => !sameLine(line, productId, size, colour)));
  }

  function updateQty(productId: string, size: string, colour: string, qty: number): void {
    if (qty <= 0) {
      removeItem(productId, size, colour);
      return;
    }

    setItems((prev) =>
      prev.map((line) => (sameLine(line, productId, size, colour) ? { ...line, qty } : line)),
    );
  }

  function clearCart(): void {
    setItems([]);
  }

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0), [items]);
  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    subtotal,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
