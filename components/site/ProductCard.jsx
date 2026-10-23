'use client';

import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/button';

export default function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart();
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || null, 1);
  };

  // Devastram-style clean variant: image on top, name below, prices inline
  if (variant === 'clean') {
    return (
      <Link href={`/product/${product.id}`} className="group block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-white border border-[#E8A9B8]/15 hover:border-saffron/40 transition">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-full object-cover img-zoom"
            loading="lazy"
          />
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-saffron text-white text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">New In</span>
          )}
          {product.bestSeller && !product.isNew && (
            <span className="absolute top-2 left-2 bg-maroon text-cream text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider border border-goldtrim/50">Bestseller</span>
          )}
        </div>
        <div className="pt-2.5 pb-1">
          <h3 className="text-maroon text-sm leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-saffron transition">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[13px] text-maroon/50 line-through">Rs. {product.mrp?.toLocaleString('en-IN')}</span>
            <span className="text-sm font-bold text-maroon">Rs. {product.price.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Default rich card (existing)
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-xl bg-white border border-[#E8A9B8]/20 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#F7F8EC]">
          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover img-zoom" loading="lazy" />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.bestSeller && <Badge className="bg-maroon text-cream hover:bg-maroon text-[10px] tracking-wider border border-goldtrim/50">BESTSELLER</Badge>}
            {product.isNew && <Badge className="bg-saffron text-white hover:bg-saffron text-[10px] tracking-wider">NEW</Badge>}
            {discount > 0 && <Badge className="bg-rosedeep text-white hover:bg-rosedeep text-[10px] font-bold">-{discount}%</Badge>}
          </div>
          <button className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-maroon hover:text-saffron shadow-md opacity-0 group-hover:opacity-100 transition">
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <Button onClick={handleQuickAdd} className="w-full bg-maroon hover:bg-maroon/90 text-cream shadow-lg" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" /> Quick Add
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-saffron mb-1.5">
            <Star className="h-3 w-3 fill-current" />
            <span className="font-semibold">{product.rating}</span>
            <span className="text-muted-foreground">({product.reviews})</span>
          </div>
          <h3 className="font-serif text-maroon text-base leading-tight line-clamp-2 min-h-[2.75rem]">{product.name}</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-maroon">₹{product.price.toLocaleString('en-IN')}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-muted-foreground line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
