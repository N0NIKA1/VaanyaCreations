'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { COLLECTIONS, siblingCollections, collectionTrail } from '@/lib/nav-data';
import { ArrowRight, ChevronRight, SlidersHorizontal } from 'lucide-react';

function App({ params }) {
  const { slug } = use(params);
  const meta = COLLECTIONS[slug];
  const siblings = siblingCollections(slug);
  const trail = collectionTrail(slug);

  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState('popular');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(48);

  const navLabel = trail[trail.length - 1]?.label || meta?.title || slug;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setVisible(48);
    fetch(`/api/collections/${slug}?sort=${sort}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug, sort]);

  if (!meta) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="font-serif text-3xl text-maroon">Collection not found</h1>
          <p className="text-plum mt-2">This collection may have moved.</p>
          <Link href="/shop"><Button className="mt-5 bg-maroon text-cream hover:bg-maroon/90">Browse all products</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero band */}
      <section className="relative overflow-hidden bg-maroon">
        {meta.image && (
          <>
            <img src={meta.image} alt={meta.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-maroon/75" />
          </>
        )}
        <div className="container mx-auto px-4 py-12 md:py-16 relative text-center">
          <nav className="flex items-center justify-center gap-1.5 text-[11px] text-cream/70 mb-3 flex-wrap">
            <Link href="/" className="hover:text-gold">Home</Link>
            {trail.map((t, i) => (
              <span key={t.label + i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3 w-3" />
                {t.href && i < trail.length - 1 ? (
                  <Link href={t.href} className="hover:text-gold">{t.label}</Link>
                ) : (
                  <span className="text-gold">{t.label}</span>
                )}
              </span>
            ))}
          </nav>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-cream leading-tight">{navLabel}</h1>
          <p className="text-cream/85 text-sm mt-3">
            {meta.count} handpicked {meta.count === 1 ? 'piece' : 'pieces'} • Handcrafted • Ships worldwide
          </p>
        </div>
      </section>

      {/* Sibling collections as pill tabs */}
      {siblings.length > 0 && (
        <section className="bg-white border-b border-gold/40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              <span className="px-4 py-2 rounded-full text-[13px] font-medium bg-maroon text-cream whitespace-nowrap">
                {navLabel}
              </span>
              {siblings.map((s) => (
                <Link
                  key={s.handle}
                  href={s.href}
                  className="px-4 py-2 rounded-full text-[13px] font-medium bg-cream text-maroon border border-gold/50 hover:border-maroon hover:text-rosedeep transition whitespace-nowrap"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sibling tiles */}
      {siblings.length > 1 && (
        <section className="container mx-auto px-4 pt-10">
          <h2 className="font-serif text-2xl md:text-3xl text-maroon text-center mb-5">Explore more in this range</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {siblings.slice(0, 6).map((s) => (
              <Link key={s.handle} href={s.href} className="group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-sm border border-gold/30 hover:shadow-xl transition">
                  <img src={s.image} alt={s.label} className="w-full h-full object-cover img-zoom" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/95 via-maroon/35 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-center">
                    <h3 className="font-serif text-cream text-[13px] md:text-sm font-semibold leading-tight">{s.label}</h3>
                    <p className="text-gold text-[9px] mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition">
                      Shop <ArrowRight className="h-2.5 w-2.5" />
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Product grid */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <p className="text-maroon/80 text-sm inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {loading ? 'Loading…' : `${products.length} product${products.length === 1 ? '' : 's'}`}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-plum text-xs hidden sm:inline">Sort by</span>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-[170px] bg-white border-gold/50 text-maroon text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">New Arrivals</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gold/30">
            <p className="font-serif text-xl text-maroon">New pieces arriving soon</p>
            <p className="text-plum text-sm mt-1">This collection is being restocked.</p>
            <Link href="/shop"><Button className="mt-5 bg-maroon text-cream hover:bg-maroon/90">Browse all products</Button></Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              {products.slice(0, visible).map((p) => <ProductCard key={p.id} product={p} variant="clean" />)}
            </div>
            {products.length > visible && (
              <div className="text-center mt-8">
                <p className="text-plum text-xs mb-3">Showing {visible} of {products.length}</p>
                <Button onClick={() => setVisible((v) => v + 48)} variant="outline" className="border-gold/60 text-maroon hover:bg-white">
                  Load more
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Trust strip */}
      <section className="bg-white border-y border-gold/40 py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { title: 'Handcrafted with Devotion', sub: 'Artisan made' },
              { title: 'Premium Fabrics & Finish', sub: 'Quality checked' },
              { title: 'Secure Packaging', sub: 'Safe delivery' },
              { title: 'PAN India + Worldwide', sub: 'COD available' },
            ].map((b, i) => (
              <div key={i}>
                <div className="font-serif text-base md:text-lg text-maroon">{b.title}</div>
                <div className="text-xs text-plum mt-1">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
