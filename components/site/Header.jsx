'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Search, Menu, Heart, User, ChevronDown, ChevronRight } from 'lucide-react';
import { useCart } from './CartProvider';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { NAV } from '@/lib/nav-data';

/* ----------------------------------------------------------------- desktop */

function LeafLink({ item }) {
  return (
    <Link
      href={item.href}
      className="flex items-center justify-between gap-3 px-4 py-2 text-[13px] text-maroon hover:bg-blush/40 hover:text-rosedeep transition rounded-md"
    >
      <span className="leading-snug">{item.label}</span>
      {item.count ? <span className="text-[10px] text-plum shrink-0">{item.count}</span> : null}
    </Link>
  );
}

function MegaPanel({ item }) {
  const groups = (item.children || []).filter((ch) => ch.children?.length);
  const leaves = (item.children || []).filter((ch) => !ch.children?.length);
  const feature = groups[0]?.children?.[0] || leaves[0];

  // simple single-column dropdown
  if (!groups.length) {
    return (
      <div className="bg-white shadow-2xl rounded-xl border border-gold/40 p-2 w-72 shrink-0 max-h-[70vh] overflow-y-auto">
        {leaves.map((ch) => <LeafLink key={ch.href + ch.label} item={ch} />)}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-2xl rounded-xl border border-gold/40 p-6 flex gap-8 w-[920px] max-w-[94vw] max-h-[76vh] overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-5 flex-1 min-w-0">
        {groups.map((g) => (
          <div key={g.label} className="min-w-0">
            {g.href ? (
              <Link href={g.href} className="block font-serif text-[15px] font-semibold text-maroon hover:text-rosedeep mb-1.5 leading-snug">
                {g.label}
              </Link>
            ) : (
              <p className="font-serif text-[15px] font-semibold text-maroon mb-1.5 leading-snug">{g.label}</p>
            )}
            <div className="space-y-0.5">
              {g.children.map((ch) => (
                <Link
                  key={ch.href + ch.label}
                  href={ch.href}
                  className="block text-[12.5px] text-plum hover:text-rosedeep transition leading-snug py-0.5"
                >
                  {ch.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {leaves.length > 0 && (
          <div className="min-w-0">
            <p className="font-serif text-[15px] font-semibold text-maroon mb-1.5">More</p>
            <div className="space-y-0.5">
              {leaves.map((ch) => (
                <Link
                  key={ch.href + ch.label}
                  href={ch.href}
                  className="block text-[12.5px] text-plum hover:text-rosedeep transition leading-snug py-0.5"
                >
                  {ch.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {feature?.image && (
        <Link href={feature.href} className="hidden lg:block w-56 shrink-0 group">
          <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-gold/40">
            <img src={feature.image} alt={feature.label} className="w-full h-full object-cover img-zoom" />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/20 to-transparent" />
            <div className="absolute bottom-0 p-3">
              <p className="text-[10px] uppercase tracking-widest text-gold mb-0.5">Featured</p>
              <p className="font-serif text-cream text-sm leading-tight">{feature.label}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ mobile */

function MobileNode({ item, depth, onNavigate }) {
  const [open, setOpen] = useState(false);
  const pad = depth === 0 ? 'px-0' : depth === 1 ? 'pl-3' : 'pl-6';

  if (!item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`block ${pad} py-2 text-[13px] ${depth === 0 ? 'text-maroon font-medium' : 'text-plum'} hover:text-rosedeep`}
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div className={pad}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between py-2 text-left ${
          depth === 0 ? 'text-maroon font-semibold text-[14px]' : 'text-maroon text-[13px] font-medium'
        }`}
      >
        <span className="pr-2 leading-snug">{item.label}</span>
        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="border-l border-gold/50 ml-1 mb-1">
          {item.href && (
            <Link href={item.href} onClick={onNavigate} className="block pl-3 py-1.5 text-[12px] text-rosedeep">
              View all {item.label}
            </Link>
          )}
          {item.children.map((ch) => (
            <MobileNode key={ch.label + (ch.href || '')} item={ch} depth={depth + 1} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ header */

export default function Header() {
  const { count } = useCart();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F8EC]/95 backdrop-blur-sm border-b border-[#E8A9B8]/30">
      {/* Top strip */}
      <div className="bg-maroon text-cream text-center text-xs py-2 px-4">
        <span className="font-medium">✨ Free shipping on orders above ₹999 • COD available across India • Ships worldwide ✨</span>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Mobile menu */}
          <div className="lg:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-maroon"><Menu className="h-6 w-6" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-cream w-[88vw] max-w-sm overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src="/brand/logo-full.png" alt="Vaanya Creations 5" className="h-20 w-auto" />
                  </SheetTitle>
                </SheetHeader>

                <form onSubmit={submitSearch} className="mt-4 flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search poshak, mukut, potli…"
                    className="bg-white border-gold/50 text-maroon placeholder:text-plum/60"
                  />
                  <Button type="submit" size="icon" className="bg-maroon text-cream hover:bg-maroon/90 shrink-0">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>

                <nav className="mt-4 divide-y divide-gold/40 pb-10">
                  {NAV.map((item) => (
                    <MobileNode key={item.label} item={item} depth={0} onNavigate={() => setMobileOpen(false)} />
                  ))}
                  <Link href="/shop" onClick={() => setMobileOpen(false)} className="block py-2 text-[13px] text-maroon font-medium">
                    Shop All Products
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0" aria-label="Vaanya Creations 5 — Home">
            <img src="/brand/logo-mark.png" alt="Vaanya Creations 5" className="h-11 w-auto sm:hidden select-none" />
            <img src="/brand/logo-full.png" alt="Vaanya Creations 5" className="hidden sm:block h-16 lg:h-[80px] w-auto select-none" />
          </Link>

          {/* Desktop search */}
          <form onSubmit={submitSearch} className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-plum/70" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for poshak, mukut, bansuri, potli…"
                className="pl-9 bg-white border-gold/50 text-maroon placeholder:text-plum/60 focus-visible:ring-rosedeep"
              />
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost" size="icon"
              onClick={() => setSearchOpen((v) => !v)}
              className="text-maroon hover:text-rosedeep lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-maroon hover:text-rosedeep hidden sm:inline-flex">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-maroon hover:text-rosedeep hidden sm:inline-flex">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="text-maroon hover:text-rosedeep relative">
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-saffron text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold">{count}</span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile expandable search */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="lg:hidden pb-3 flex gap-2">
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search poshak, mukut, potli…"
              className="bg-white border-gold/50 text-maroon placeholder:text-plum/60"
            />
            <Button type="submit" className="bg-maroon text-cream hover:bg-maroon/90 shrink-0">Search</Button>
          </form>
        )}
      </div>

      {/* Desktop mega-menu bar */}
      <nav className="hidden lg:block bg-maroon border-t border-gold/25">
        <div className="container mx-auto px-4 relative">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0 py-1.5">
            {NAV.map((item, idx) => {
              const isMega = item.children?.some((ch) => ch.children?.length);
              const alignRight = idx >= NAV.length - 3;
              return (
                <li key={item.label} className={isMega ? 'group' : 'relative group'}>
                  {item.href && !item.children ? (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 px-3 py-2 text-[13px] text-cream hover:text-gold transition whitespace-nowrap"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button className="flex items-center gap-1 px-3 py-2 text-[13px] text-cream group-hover:text-gold transition whitespace-nowrap">
                        {item.label}
                        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
                      </button>
                      <div
                        className={
                          isMega
                            ? 'absolute left-0 right-0 top-full pt-1 hidden group-hover:flex justify-center z-50'
                            : `absolute ${alignRight ? 'right-0' : 'left-0'} top-full pt-1 hidden group-hover:block z-50`
                        }
                      >
                        <MegaPanel item={item} />
                      </div>
                    </>
                  )}
                </li>
              );
            })}
            <li>
              <Link href="/shop" className="px-3 py-2 text-[13px] text-cream hover:text-gold transition whitespace-nowrap">
                Shop All
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
