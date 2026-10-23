'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { DEITIES, CATEGORIES } from '@/lib/products-data';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SlidersHorizontal, X } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialDeity = searchParams.get('deity') || '';
  const initialCategory = searchParams.get('category') || '';
  const initialCollection = searchParams.get('collection') || '';
  const initialSubcategory = searchParams.get('subcategory') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deity, setDeity] = useState(initialDeity);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState([0, 12000]);
  const [sort, setSort] = useState('popular');
  const [visible, setVisible] = useState(48);

  useEffect(() => {
    setLoading(true);
    setVisible(48);
    const params = new URLSearchParams();
    if (deity) params.set('deity', deity);
    if (category) params.set('category', category);
    if (initialCollection) params.set('collection', initialCollection);
    if (initialSubcategory) params.set('subcategory', initialSubcategory);
    if (initialSearch) params.set('search', initialSearch);
    params.set('sort', sort);
    params.set('priceMax', priceRange[1]);
    params.set('priceMin', priceRange[0]);
    fetch(`/api/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setLoading(false); });
  }, [deity, category, priceRange, sort, initialCollection, initialSubcategory, initialSearch]);

  const clearFilters = () => { setDeity(''); setCategory(''); setPriceRange([0, 12000]); };

  const FiltersPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-serif text-maroon text-lg mb-3">Deity</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="deity-all" checked={deity === ''} onCheckedChange={() => setDeity('')} />
            <Label htmlFor="deity-all" className="text-sm cursor-pointer text-maroon">All deities</Label>
          </div>
          {DEITIES.map((d) => (
            <div key={d.slug} className="flex items-center space-x-2">
              <Checkbox id={`deity-${d.slug}`} checked={deity === d.slug} onCheckedChange={() => setDeity(deity === d.slug ? '' : d.slug)} />
              <Label htmlFor={`deity-${d.slug}`} className="text-sm cursor-pointer text-maroon">{d.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-maroon text-lg mb-3">Category</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="cat-all" checked={category === ''} onCheckedChange={() => setCategory('')} />
            <Label htmlFor="cat-all" className="text-sm cursor-pointer text-maroon">All categories</Label>
          </div>
          {CATEGORIES.map((c) => (
            <div key={c.slug} className="flex items-center space-x-2">
              <Checkbox id={`cat-${c.slug}`} checked={category === c.slug} onCheckedChange={() => setCategory(category === c.slug ? '' : c.slug)} />
              <Label htmlFor={`cat-${c.slug}`} className="text-sm cursor-pointer text-maroon">{c.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-serif text-maroon text-lg mb-3">Price: ₹{priceRange[0]} — ₹{priceRange[1]}</h3>
        <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={12000} step={100} className="mt-2" />
      </div>

      <Button variant="outline" onClick={clearFilters} className="w-full border-maroon text-maroon hover:bg-maroon hover:text-cream">
        Clear Filters
      </Button>
    </div>
  );

  const activeTitle = deity
    ? DEITIES.find(d => d.slug === deity)?.name + ' Collection'
    : category ? CATEGORIES.find(c => c.slug === category)?.name : 'All Products';

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-1">Shop</p>
          <h1 className="font-serif text-4xl md:text-5xl text-maroon">{activeTitle}</h1>
          <p className="text-maroon/70 mt-2">{loading ? 'Loading...' : `${products.length} products`}</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-white rounded-2xl p-6 border border-gold/30 shadow-sm">
              <FiltersPanel />
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-maroon text-maroon">
                    <SlidersHorizontal className="h-4 w-4 mr-2" /> Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-cream w-80 overflow-y-auto">
                  <SheetHeader><SheetTitle className="text-maroon font-serif">Filters</SheetTitle></SheetHeader>
                  <div className="mt-6"><FiltersPanel /></div>
                </SheetContent>
              </Sheet>

              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-52 border-gold/40 bg-white text-maroon">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-white/50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-maroon text-lg font-serif">No products found</p>
                <Button onClick={clearFilters} className="mt-4 bg-maroon text-cream">Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {products.slice(0, visible).map((p) => <ProductCard key={p.id} product={p} />)}
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
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <ShopContent />
    </Suspense>
  );
}

export default App;
