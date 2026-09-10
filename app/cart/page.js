'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck, Tag } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/site/CartProvider';
import { toast } from 'sonner';

function App() {
  const { items, updateQty, removeItem, subtotal, discount, totalMrp, clearCart, hydrated } = useCart();
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(0);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'BLESSED10') {
      setCouponApplied(Math.round(subtotal * 0.1));
      toast.success('Coupon BLESSED10 applied — 10% off!');
    } else if (coupon.toUpperCase() === 'DIWALI15') {
      setCouponApplied(Math.round(subtotal * 0.15));
      toast.success('Coupon DIWALI15 applied — 15% off!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = subtotal - couponApplied + shipping;

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-20" />
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-white border-2 border-gold/40 flex items-center justify-center mx-auto">
            <ShoppingBag className="h-10 w-10 text-saffron" />
          </div>
          <h1 className="font-serif text-4xl text-maroon mt-6">Your cart is empty</h1>
          <p className="text-maroon/70 mt-2">Discover our handcrafted collection</p>
          <Link href="/shop">
            <Button size="lg" className="bg-maroon hover:bg-maroon/90 text-cream mt-6">Shop Now</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-maroon">Your Cart</h1>
          <p className="text-maroon/70 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-4 bg-white rounded-2xl p-4 border border-gold/30">
                <Link href={`/product/${item.id}`} className="w-24 md:w-32 aspect-square rounded-xl overflow-hidden bg-cream flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="font-serif text-maroon text-base md:text-lg leading-tight line-clamp-2">{item.name}</h3>
                      </Link>
                      {item.size && <p className="text-xs text-maroon/60 mt-1">Size: {item.size}</p>}
                    </div>
                    <button onClick={() => removeItem(item.key)} className="text-maroon/40 hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <div className="inline-flex items-center border-2 border-gold/30 rounded-lg">
                      <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-2.5 py-1.5 text-maroon hover:bg-cream"><Minus className="h-3 w-3" /></button>
                      <span className="px-3 py-1 text-maroon font-semibold text-sm min-w-[2rem] text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-2.5 py-1.5 text-maroon hover:bg-cream"><Plus className="h-3 w-3" /></button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-maroon">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                      {item.mrp && item.mrp > item.price && (
                        <div className="text-xs text-maroon/50 line-through">₹{(item.mrp * item.qty).toLocaleString('en-IN')}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" onClick={clearCart} className="text-maroon/60 hover:text-destructive">Clear cart</Button>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-28 bg-white rounded-2xl p-6 border border-gold/30 shadow-md space-y-4">
              <h2 className="font-serif text-2xl text-maroon">Order Summary</h2>

              {/* Coupon */}
              <div>
                <div className="flex gap-2">
                  <Input placeholder="Coupon code" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="bg-cream border-gold/40" />
                  <Button onClick={applyCoupon} variant="outline" className="border-maroon text-maroon">Apply</Button>
                </div>
                <p className="text-xs text-maroon/60 mt-2 flex items-center gap-1">
                  <Tag className="h-3 w-3" /> Try <span className="font-semibold text-saffron">BLESSED10</span> or <span className="font-semibold text-saffron">DIWALI15</span>
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-gold/20">
                <div className="flex justify-between text-maroon">
                  <span>Subtotal (MRP)</span>
                  <span>₹{totalMrp.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-saffron">
                    <span>Product discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                {couponApplied > 0 && (
                  <div className="flex justify-between text-saffron">
                    <span>Coupon discount</span>
                    <span>-₹{couponApplied.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-maroon">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <Badge className="bg-saffron text-white">FREE</Badge> : `₹${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-4 border-t border-gold/20">
                <span className="font-serif text-xl text-maroon">Total</span>
                <span className="font-serif text-2xl font-bold text-maroon">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <Button size="lg" onClick={() => toast.info('Payment gateway coming soon', { description: 'Razorpay & PayPal integration in Phase 2. Order will be placed as COD for now.' })} className="w-full bg-maroon hover:bg-maroon/90 text-cream">
                Proceed to Checkout
              </Button>

              <div className="space-y-2 pt-4 border-t border-gold/20 text-xs text-maroon/70">
                <p className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-saffron" /> Free shipping on orders above ₹999</p>
                <p className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-saffron" /> Secure checkout • COD available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
