'use client';

import { useState } from 'react';
import Link from 'next/link';
import PolicyLayout from '@/components/site/PolicyLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Package, Search, CheckCircle2, Truck, Clock } from 'lucide-react';

const STAGES = [
  { key: 'pending', label: 'Order placed', icon: Clock },
  { key: 'packed', label: 'Packed in studio', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

function App() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const track = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId.trim())}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || 'We could not find that order ID.');
      else setOrder(data.order);
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const activeIndex = order ? Math.max(0, STAGES.findIndex((s) => s.key === (order.status || 'pending'))) : -1;

  return (
    <PolicyLayout
      eyebrow="Support"
      title="Track Your Order"
      intro="Enter the order ID from your confirmation message (it starts with VH-)."
    >
      <form onSubmit={track} className="flex flex-col sm:flex-row gap-3">
        <Input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="VH-XXXXXXXX"
          className="bg-cream border-gold/50 text-maroon placeholder:text-plum/60"
        />
        <Button type="submit" disabled={loading} className="bg-maroon text-cream hover:bg-maroon/90 shrink-0">
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Checking…' : 'Track Order'}
        </Button>
      </form>

      {error && (
        <div className="mt-6 rounded-xl border border-gold/50 bg-cream p-5 text-center">
          <p className="text-maroon font-medium">{error}</p>
          <p className="text-plum text-sm mt-1">
            Need help? <Link href="/contact" className="text-rosedeep underline">Contact our team</Link> with your order details.
          </p>
        </div>
      )}

      {order && (
        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/50 pb-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-plum">Order ID</p>
              <p className="font-serif text-2xl text-maroon">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-widest text-plum">Order total</p>
              <p className="font-serif text-2xl text-maroon">₹{(order.total || 0).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {STAGES.map((s, i) => {
              const done = i <= activeIndex;
              return (
                <div key={s.key} className={`rounded-xl border p-4 text-center ${done ? 'bg-maroon border-maroon text-cream' : 'bg-cream border-gold/50 text-plum'}`}>
                  <s.icon className={`h-5 w-5 mx-auto mb-2 ${done ? 'text-gold' : 'text-plum/70'}`} />
                  <p className="text-[12px] font-medium leading-tight">{s.label}</p>
                </div>
              );
            })}
          </div>

          {order.items?.length > 0 && (
            <div className="mt-8">
              <h3 className="font-serif text-xl text-maroon mb-3">Items in this order</h3>
              <div className="space-y-3">
                {order.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-3 border border-gold/40 rounded-xl p-3 bg-cream">
                    {it.images?.[0] && <img src={it.images[0]} alt={it.name} className="w-14 h-14 rounded-lg object-cover" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-maroon text-sm font-medium truncate">{it.name}</p>
                      <p className="text-plum text-xs">Qty {it.qty || it.quantity || 1}{it.size ? ` • Size ${it.size}` : ''}</p>
                    </div>
                    <p className="text-maroon text-sm font-semibold">₹{(it.price || 0).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-plum text-xs mt-6">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
            {order.paymentMethod ? ` • Payment: ${String(order.paymentMethod).toUpperCase()}` : ''}
          </p>
        </div>
      )}
    </PolicyLayout>
  );
}

export default App;
