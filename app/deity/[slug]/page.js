'use client';

import { use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { DEITIES } from '@/lib/products-data';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProductCarousel({ products }) {
  const scrollRef = useRef(null);
  const scrollBy = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };
  if (!products?.length) return null;
  return (
    <div className="relative">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4" style={{ scrollbarWidth: 'none' }}>
        {products.map((p) => (
          <div key={p.id} className="flex-shrink-0 w-[46%] sm:w-[32%] md:w-[24%] lg:w-[19%] snap-start">
            <ProductCard product={p} variant="clean" />
          </div>
        ))}
      </div>
      <button onClick={() => scrollBy(-1)} className="hidden md:flex absolute -left-4 top-[38%] w-10 h-10 rounded-full bg-white border border-gold/40 items-center justify-center shadow-md hover:bg-maroon hover:text-cream text-maroon transition z-10">
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button onClick={() => scrollBy(1)} className="hidden md:flex absolute -right-4 top-[38%] w-10 h-10 rounded-full bg-white border border-gold/40 items-center justify-center shadow-md hover:bg-maroon hover:text-cream text-maroon transition z-10">
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function App({ params }) {
  const { slug } = use(params);
  const deity = DEITIES.find((d) => d.slug === slug);
  const [meta, setMeta] = useState({ subcategories: [], collections: [] });
  const [allProducts, setAllProducts] = useState([]);
  const [activeSubcat, setActiveSubcat] = useState('');
  const [bestSellers, setBestSellers] = useState([]);
  const [newIn, setNewIn] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/deity-meta/${slug}`).then((r) => r.json()),
      fetch(`/api/products?deity=${slug}`).then((r) => r.json()),
      fetch(`/api/products?deity=${slug}&bestSeller=true`).then((r) => r.json()),
      fetch(`/api/products?deity=${slug}&isNew=true`).then((r) => r.json()),
    ]).then(([m, all, bs, ni]) => {
      setMeta(m);
      setAllProducts(all.products || []);
      setBestSellers(bs.products || []);
      setNewIn(ni.products || []);
      if (m.subcategories?.[0]) setActiveSubcat(m.subcategories[0].slug);
      setLoading(false);
    });
  }, [slug]);

  if (!deity) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-maroon">Deity not found</h1>
          <Link href="/shop"><Button className="mt-4 bg-maroon text-cream">Browse all products</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const hasSubcats = meta.subcategories?.length > 0;
  const currentSubProducts = hasSubcats ? allProducts.filter((p) => p.subcategory === activeSubcat) : allProducts;

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="relative overflow-hidden bg-maroon">
        <img src={deity.image} alt={deity.name} className="absolute inset-0 w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-maroon/70" />
        <div className="container mx-auto px-4 py-16 md:py-20 relative text-center">
          <Sparkles className="h-6 w-6 text-gold mx-auto mb-3" />
          <p className="text-gold font-semibold uppercase tracking-widest text-xs mb-2">Divine Collection</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream">{deity.name}</h1>
          <p className="text-cream/90 text-base md:text-lg mt-3 max-w-xl mx-auto">{deity.tagline}</p>
          <div className="mt-5 flex items-center justify-center gap-6 text-cream/70 text-xs">
            <span>✨ {allProducts.length} products</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Handcrafted</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Ships worldwide</span>
          </div>
        </div>
      </section>

      {meta.collections?.length > 0 && (
        <section className="container mx-auto px-4 py-10">
          <div className="text-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl text-maroon">{deity.name} Collections</h2>
          </div>
          <div className={`grid grid-cols-2 gap-3 ${meta.collections.length <= 4 ? 'md:grid-cols-4' : 'md:grid-cols-5'}`}>
            {meta.collections.map((c) => (
              <Link key={c.slug} href={`/collection/${c.slug}`} className="group">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-md border border-gold/20 hover:shadow-xl transition">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover img-zoom" />
                  <div className="absolute inset-0 bg-gradient-to-t from-maroon/95 via-maroon/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <h3 className="font-serif text-cream text-base md:text-lg font-semibold leading-tight">{c.name}</h3>
                    <p className="text-gold text-[10px] mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition">Shop Now <ArrowRight className="h-3 w-3" /></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {hasSubcats && (
        <section className="container mx-auto px-4 py-10 border-t border-gold/20">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-saffron font-semibold uppercase tracking-widest text-[11px] mb-1">Featured</p>
              <h2 className="font-serif text-3xl md:text-4xl text-maroon">Shop {deity.name}</h2>
            </div>
            <Link href={`/shop?deity=${slug}`} className="text-maroon hover:text-saffron text-sm inline-flex items-center gap-1">View All <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {meta.subcategories.map((sc) => (
              <button key={sc.slug} onClick={() => setActiveSubcat(sc.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition border ${activeSubcat === sc.slug ? 'bg-maroon text-cream border-maroon' : 'bg-white text-maroon border-gold/40 hover:border-maroon'}`}>
                {sc.name}
              </button>
            ))}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Array.from({ length: 5 }).map((_, i) => (<div key={i} className="aspect-square bg-white/50 rounded-lg animate-pulse" />))}
            </div>
          ) : currentSubProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gold/20">
              <p className="text-maroon/70">No products in this category yet — coming soon</p>
            </div>
          ) : (
            <ProductCarousel products={currentSubProducts} />
          )}
        </section>
      )}

      {(bestSellers.length > 0 || newIn.length > 0) && (
        <section className="container mx-auto px-4 py-10 border-t border-gold/20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-saffron font-semibold uppercase tracking-widest text-[11px] mb-1">Loved by devotees</p>
              <h2 className="font-serif text-3xl md:text-4xl text-maroon">New In & Bestsellers</h2>
            </div>
          </div>
          <ProductCarousel products={[...newIn, ...bestSellers].slice(0, 12)} />
        </section>
      )}

      <section className="container mx-auto px-4 py-10 border-t border-gold/20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="font-serif text-3xl md:text-4xl text-maroon">All {deity.name} Products</h2>
          <p className="text-maroon/70 text-sm">{allProducts.length} items</p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (<div key={i} className="aspect-square bg-white/50 rounded-lg animate-pulse" />))}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-maroon text-lg font-serif">No products yet for {deity.name}</p>
            <Link href="/shop"><Button className="mt-4 bg-maroon text-cream">Browse other collections</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            {allProducts.map((p) => <ProductCard key={p.id} product={p} variant="clean" />)}
          </div>
        )}
      </section>

      <section className="bg-white border-y border-gold/30 py-10 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[{ title: 'Handcrafted by Skilled Artisans', sub: 'Vrindavan • Moradabad' }, { title: 'Premium Quality Fabrics', sub: 'Pure silk & brocade' }, { title: 'Triple Quality Check', sub: 'Before shipping' }, { title: 'Secure Packaging', sub: 'Fast delivery' }].map((b, i) => (
              <div key={i}>
                <div className="font-serif text-base md:text-lg text-maroon">{b.title}</div>
                <div className="text-xs text-maroon/60 mt-1">{b.sub}</div>
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
