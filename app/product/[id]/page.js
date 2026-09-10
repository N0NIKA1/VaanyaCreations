'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart, Truck, ShieldCheck, RefreshCw, Sparkles, Minus, Plus } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useCart } from '@/components/site/CartProvider';
import { toast } from 'sonner';

function App({ params }) {
  const { id } = use(params);
  const [data, setData] = useState({ product: null, related: [] });
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryEst, setDeliveryEst] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => {
      setData(d);
      if (d.product?.sizes?.length) setSelectedSize(d.product.sizes[0]);
      setLoading(false);
    });
  }, [id]);

  const checkPincode = () => {
    if (pincode.length !== 6) { toast.error('Enter a valid 6-digit pincode'); return; }
    const days = 3 + (parseInt(pincode[0]) % 4);
    setDeliveryEst(`Delivers in ${days}-${days + 2} days • COD Available`);
  };

  const handleAddToCart = () => {
    if (!data.product) return;
    if (data.product.sizes?.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    addToCart(data.product, selectedSize, qty);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-20 grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-white/50 rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-white/50 rounded animate-pulse w-3/4" />
            <div className="h-6 bg-white/50 rounded animate-pulse w-1/2" />
            <div className="h-24 bg-white/50 rounded animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const p = data.product;
  if (!p) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-3xl text-maroon">Product not found</h1>
          <Link href="/shop"><Button className="mt-4 bg-maroon text-cream">Browse products</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discount = p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="text-xs text-maroon/70 mb-4">
          <Link href="/" className="hover:text-saffron">Home</Link> / <Link href="/shop" className="hover:text-saffron">Shop</Link> / <span className="text-maroon">{p.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gold/30 shadow-md">
              <img src={p.images[selectedImg]} alt={p.name} className="w-full h-full object-cover img-zoom" />
              {p.bestSeller && (
                <Badge className="absolute top-4 left-4 bg-maroon text-cream tracking-wider">BESTSELLER</Badge>
              )}
            </div>
            {p.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {p.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${selectedImg === i ? 'border-saffron' : 'border-gold/30'}`}>
                    <img src={img} alt={`${p.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-1 text-saffron">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-semibold text-sm">{p.rating}</span>
              </div>
              <span className="text-sm text-maroon/60">({p.reviews} reviews)</span>
              {p.isNew && <Badge className="bg-saffron text-white">NEW</Badge>}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-maroon leading-tight">{p.name}</h1>

            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-maroon">₹{p.price.toLocaleString('en-IN')}</span>
              {p.mrp && p.mrp > p.price && (
                <>
                  <span className="text-lg text-maroon/50 line-through">₹{p.mrp.toLocaleString('en-IN')}</span>
                  <Badge className="bg-gold text-maroon">{discount}% OFF</Badge>
                </>
              )}
            </div>
            <p className="text-xs text-maroon/70 mt-1">Inclusive of all taxes</p>

            {/* Size selector */}
            {p.sizes?.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-maroon text-sm">Size: {selectedSize}</p>
                  <button className="text-xs text-saffron hover:underline">Size guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map((s) => (
                    <button key={s} onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition ${selectedSize === s ? 'border-maroon bg-maroon text-cream' : 'border-gold/40 text-maroon hover:border-maroon'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <p className="font-semibold text-maroon text-sm mb-3">Quantity</p>
              <div className="inline-flex items-center border-2 border-gold/40 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-maroon hover:bg-cream"><Minus className="h-4 w-4" /></button>
                <span className="px-4 py-2 text-maroon font-semibold min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-maroon hover:bg-cream"><Plus className="h-4 w-4" /></button>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button size="lg" onClick={handleAddToCart} className="flex-1 bg-maroon hover:bg-maroon/90 text-cream">
                <ShoppingBag className="h-5 w-5 mr-2" /> Add to Cart
              </Button>
              <Button size="lg" variant="outline" onClick={() => { handleAddToCart(); setTimeout(() => window.location.href = '/cart', 500); }} className="flex-1 border-maroon text-maroon hover:bg-maroon hover:text-cream">
                Buy Now
              </Button>
              <Button size="lg" variant="outline" className="border-gold/40 text-maroon hover:bg-cream">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Delivery estimator */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gold/30">
              <p className="font-semibold text-maroon text-sm mb-3 flex items-center gap-2"><Truck className="h-4 w-4" /> Delivery & COD Estimate</p>
              <div className="flex gap-2">
                <Input placeholder="Enter 6-digit pincode" value={pincode} onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="bg-cream" />
                <Button onClick={checkPincode} className="bg-maroon text-cream">Check</Button>
              </div>
              {deliveryEst && <p className="text-sm text-saffron mt-3 font-medium">✓ {deliveryEst}</p>}
            </div>

            {/* Trust chips */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-white rounded-lg border border-gold/30">
                <Sparkles className="h-5 w-5 text-saffron mx-auto" />
                <p className="text-xs text-maroon mt-1 font-medium">Handcrafted</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gold/30">
                <ShieldCheck className="h-5 w-5 text-saffron mx-auto" />
                <p className="text-xs text-maroon mt-1 font-medium">QC verified</p>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-gold/30">
                <RefreshCw className="h-5 w-5 text-saffron mx-auto" />
                <p className="text-xs text-maroon mt-1 font-medium">Easy exchange</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="mt-10">
              <TabsList className="grid grid-cols-3 bg-white border border-gold/30">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="materials">Materials & Care</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 text-maroon/85 leading-relaxed">
                {p.description}
                {p.fabric && <div className="mt-4 grid grid-cols-2 gap-2 text-sm"><div><span className="font-semibold">Fabric:</span> {p.fabric}</div><div><span className="font-semibold">Color:</span> {p.color}</div>{p.occasion && <div><span className="font-semibold">Occasion:</span> {p.occasion}</div>}</div>}
              </TabsContent>
              <TabsContent value="materials" className="mt-4 text-maroon/85 leading-relaxed space-y-3">
                <p><span className="font-semibold text-maroon">Materials:</span> {p.materials}</p>
                <p><span className="font-semibold text-maroon">Care:</span> {p.care}</p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-4">
                <div className="flex items-center gap-4 pb-4 border-b border-gold/20">
                  <div className="text-4xl font-bold text-maroon font-serif">{p.rating}</div>
                  <div>
                    <div className="flex gap-1 text-saffron">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}</div>
                    <p className="text-xs text-maroon/70 mt-1">Based on {p.reviews} verified reviews</p>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  {['Divine quality, arrived beautifully packaged. My Kanha ji looks resplendent!', 'Fit is perfect, colors exactly as pictured. Highly recommend for Janmashtami.', 'The zari work is exquisite. Worth every rupee.'].map((r, i) => (
                    <div key={i} className="pb-4 border-b border-gold/10 last:border-0">
                      <div className="flex gap-1 text-saffron mb-1">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-3 w-3 fill-current" />)}</div>
                      <p className="text-sm text-maroon/85 italic">“{r}”</p>
                      <p className="text-xs text-maroon/60 mt-1">— Verified buyer</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* You may also like */}
        {data.related?.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-3xl text-maroon mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {data.related.slice(0, 4).map((rp) => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default App;
