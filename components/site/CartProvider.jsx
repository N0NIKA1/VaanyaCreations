'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

const CartContext = createContext(null);
const STORAGE_KEY = 'vanya_cart_v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addToCart = useCallback((product, size, qty = 1) => {
    setItems((prev) => {
      const key = product.id + '|' + (size || 'default');
      const idx = prev.findIndex((i) => i.key === key);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
        return updated;
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          mrp: product.mrp,
          image: product.images?.[0],
          size: size || null,
          qty,
        },
      ];
    });
    toast.success('Added to cart', { description: product.name });
  }, []);

  const updateQty = useCallback((key, qty) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key));
    } else {
      setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)));
    }
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
    toast.info('Removed from cart');
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalMrp = items.reduce((s, i) => s + (i.mrp || i.price) * i.qty, 0);
  const discount = totalMrp - subtotal;
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeItem, clearCart, subtotal, totalMrp, discount, count, hydrated }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
