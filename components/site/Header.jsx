'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, Search, Menu, Heart, User, X } from 'lucide-react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { DEITIES, CATEGORIES } from '@/lib/products-data';

export default function Header() {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FDF6E3]/95 backdrop-blur-sm border-b border-[#C89B3C]/30">
      {/* Top strip */}
      <div className="bg-maroon text-cream text-center text-xs py-2 px-4">
        <span className="font-medium">✨ Free shipping on orders above ₹999 • COD available across India • Ships worldwide ✨</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-maroon"><Menu className="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-cream w-80">
                <SheetHeader>
                  <SheetTitle className="text-maroon font-serif text-2xl">Vanya Handicrafts</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-saffron uppercase tracking-wider mb-3">Shop by Deity</p>
                    <div className="space-y-2">
                      {DEITIES.map((d) => (
                        <Link key={d.slug} href={`/deity/${d.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 text-maroon hover:text-saffron">{d.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-saffron uppercase tracking-wider mb-3">Categories</p>
                    <div className="space-y-2">
                      {CATEGORIES.map((c) => (
                        <Link key={c.slug} href={`/shop?category=${c.slug}`} onClick={() => setMobileOpen(false)} className="block py-1.5 text-maroon hover:text-saffron">{c.name}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-[#C89B3C]/30 pt-4 space-y-2">
                    <Link href="/about" onClick={() => setMobileOpen(false)} className="block py-1.5 text-maroon">About Us</Link>
                    <Link href="/contact" onClick={() => setMobileOpen(false)} className="block py-1.5 text-maroon">Contact</Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center shadow-md">
              <span className="font-serif text-white text-2xl font-bold">V</span>
            </div>
            <div className="leading-tight">
              <div className="font-serif text-2xl font-bold text-maroon tracking-wide">Vanya</div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-saffron -mt-1">Handicrafts</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-maroon hover:text-saffron font-medium transition">Home</Link>
            <div className="relative group">
              <button className="text-maroon hover:text-saffron font-medium transition">Shop by Deity</button>
              <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="bg-white shadow-xl rounded-lg border border-[#C89B3C]/30 py-3 w-56">
                  {DEITIES.map((d) => (
                    <Link key={d.slug} href={`/deity/${d.slug}`} className="block px-4 py-2 text-maroon hover:bg-[#FDF6E3] hover:text-saffron">{d.name}</Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative group">
              <button className="text-maroon hover:text-saffron font-medium transition">Categories</button>
              <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                <div className="bg-white shadow-xl rounded-lg border border-[#C89B3C]/30 py-3 w-56">
                  {CATEGORIES.map((c) => (
                    <Link key={c.slug} href={`/shop?category=${c.slug}`} className="block px-4 py-2 text-maroon hover:bg-[#FDF6E3] hover:text-saffron">{c.name}</Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/shop" className="text-maroon hover:text-saffron font-medium transition">Shop All</Link>
            <Link href="/about" className="text-maroon hover:text-saffron font-medium transition">About</Link>
            <Link href="/contact" className="text-maroon hover:text-saffron font-medium transition">Contact</Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" className="text-maroon hover:text-saffron hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-maroon hover:text-saffron hidden sm:inline-flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-maroon hover:text-saffron hidden sm:inline-flex">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-maroon hover:text-saffron relative">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-saffron text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">{count}</span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
