'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, ShieldCheck, RefreshCw, Award, Star } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import ProductCard from '@/components/site/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEITIES, CATEGORIES, TESTIMONIALS, IMG } from '@/lib/products-data';
import { toast } from 'sonner';

function App() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetch('/api/products?bestSeller=true').then(r => r.json()).then(d => setBestSellers(d.products || []));
    fetch('/api/products?isNew=true').then(r => r.json()).then(d => setNewArrivals(d.products || []));
  }, []);

  const subscribeNewsletter = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      toast.success('Welcome to the Vanya family!', { description: 'Enjoy 10% off your first order.' });
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 mandala-bg" />
        <div className="container mx-auto px-4 py-12 md:py-20 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-saffron" />
                <span className="text-xs font-medium text-maroon tracking-wider uppercase">Handcrafted with devotion</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-maroon leading-[1.05]">
                Adorn your <span className="text-saffron">Aradhya</span> in divine grace
              </h1>
              <p className="text-lg text-maroon/75 max-w-lg leading-relaxed">
                Exquisite Poshak, Shringar and antique puja items — lovingly handcrafted by Indian artisans and shipped across the world.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop">
                  <Button size="lg" className="bg-maroon hover:bg-maroon/90 text-cream shadow-lg">
                    Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/deity/laddu-gopal">
                  <Button size="lg" variant="outline" className="border-maroon text-maroon hover:bg-maroon hover:text-cream">
                    Laddu Gopal Poshak
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div>
                  <div className="text-2xl font-bold text-maroon font-serif">10,000+</div>
                  <div className="text-xs text-maroon/70">Happy devotees</div>
                </div>
                <div className="w-px h-10 bg-gold/40" />
                <div>
                  <div className="text-2xl font-bold text-maroon font-serif">4.9★</div>
                  <div className="text-xs text-maroon/70">Customer rating</div>
                </div>
                <div className="w-px h-10 bg-gold/40" />
                <div>
                  <div className="text-2xl font-bold text-maroon font-serif">25+</div>
                  <div className="text-xs text-maroon/70">Countries served</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 gold-gradient opacity-20 blur-2xl rounded-full" />
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-gold/40 shadow-2xl">
                <img src={IMG.hero} alt="Divine deity handcrafted" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-xl border border-gold/30 max-w-[200px] hidden sm:block">
                <div className="flex items-center gap-2">
                  <Award className="h-8 w-8 text-saffron" />
                  <div>
                    <div className="text-xs font-bold text-maroon">Artisan-made</div>
                    <div className="text-[10px] text-maroon/70">Since 1998 tradition</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-gold/30 bg-white/60 py-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Award, title: 'Handmade', sub: 'Real artisans' },
            { icon: ShieldCheck, title: 'Quality Checked', sub: 'Every piece inspected' },
            { icon: RefreshCw, title: 'Easy Exchange', sub: '7-day policy' },
            { icon: Truck, title: 'Ships PAN India + Global', sub: 'COD available' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-saffron/10 flex items-center justify-center">
                <b.icon className="h-5 w-5 text-saffron" />
              </div>
              <div>
                <div className="font-semibold text-maroon text-sm">{b.title}</div>
                <div className="text-xs text-maroon/60">{b.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Deity */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Iconic Collections</p>
          <h2 className="font-serif text-4xl md:text-5xl text-maroon">Shop by Deity</h2>
          <p className="text-maroon/70 mt-3">From Laddu Gopal to Mata Rani — find the perfect vastra for every Aradhya</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DEITIES.map((d) => (
            <Link key={d.slug} href={`/deity/${d.slug}`} className="group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-md border border-gold/30 hover:shadow-xl transition">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover img-zoom" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 via-maroon/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <h3 className="font-serif text-cream text-lg font-semibold leading-tight">{d.name}</h3>
                  <p className="text-cream/80 text-[10px] mt-0.5">{d.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-1">Loved by devotees</p>
            <h2 className="font-serif text-4xl text-maroon">Best Sellers</h2>
          </div>
          <Link href="/shop" className="text-maroon hover:text-saffron font-medium inline-flex items-center gap-1 text-sm">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Festival banner */}
      <section className="container mx-auto px-4 py-12">
        <div className="relative rounded-3xl overflow-hidden bg-maroon">
          <img src={IMG.diwaliDiyas} alt="Janmashtami festive collection" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="relative p-8 md:p-14 text-center text-cream">
            <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Festive Collection</p>
            <h3 className="font-serif text-4xl md:text-6xl font-bold mb-3">Janmashtami Special</h3>
            <p className="text-cream/90 max-w-xl mx-auto mb-6 text-lg">Fresh Laddu Gopal poshak and shringar sets — up to 30% off</p>
            <Link href="/deity/laddu-gopal">
              <Button size="lg" className="bg-gold text-maroon hover:bg-gold/90 font-semibold">
                Shop Festive Sale <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Explore</p>
          <h2 className="font-serif text-4xl md:text-5xl text-maroon">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { slug: 'dresses', name: 'Deity Dresses', img: IMG.radhaKrishnaPoshak },
            { slug: 'antiques', name: 'Handmade Antiques', img: IMG.elephants },
            { slug: 'puja-items', name: 'Puja Items', img: IMG.pujaItems },
            { slug: 'jewellery', name: 'Jewellery & Shringar', img: IMG.durgaMarigold },
            { slug: 'home-decor', name: 'Home Decor', img: IMG.dancers },
            { slug: 'gifting', name: 'Gifting', img: IMG.brassCollection },
          ].map((c) => (
            <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition">
              <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover img-zoom" />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-cream text-2xl md:text-3xl font-bold">{c.name}</h3>
                <p className="text-cream/80 text-sm mt-1 inline-flex items-center gap-1 group-hover:gap-2 transition">
                  Shop now <ArrowRight className="h-4 w-4" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Antiques feature */}
      <section className="bg-white border-y border-gold/30 py-16">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-10 items-center">
          <div className="grid grid-cols-2 gap-3">
            <img src={IMG.brassCollection} alt="Brass idols" className="aspect-square rounded-2xl object-cover shadow-lg" />
            <img src={IMG.dancers} alt="Handcrafted figurines" className="aspect-square rounded-2xl object-cover shadow-lg mt-8" />
            <img src={IMG.brassBells} alt="Brass bells" className="aspect-square rounded-2xl object-cover shadow-lg" />
            <img src={IMG.elephants} alt="Elephant figurines" className="aspect-square rounded-2xl object-cover shadow-lg mt-8" />
          </div>
          <div>
            <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Handmade Antiques</p>
            <h2 className="font-serif text-4xl md:text-5xl text-maroon leading-tight">Where tradition meets craftsmanship</h2>
            <p className="text-maroon/75 mt-4 leading-relaxed">
              Every brass idol and wooden puja piece is hand-cast by artisan families from Moradabad, Jaipur and Kumbakonam. Real materials, real hands, real heritage — built to be passed down generations.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div><div className="text-2xl font-bold text-maroon font-serif">120+</div><div className="text-xs text-maroon/70">Artisan families</div></div>
              <div><div className="text-2xl font-bold text-maroon font-serif">100%</div><div className="text-xs text-maroon/70">Handcrafted</div></div>
              <div><div className="text-2xl font-bold text-maroon font-serif">Pure</div><div className="text-xs text-maroon/70">Brass & wood</div></div>
            </div>
            <Link href="/shop?category=antiques" className="inline-block mt-6">
              <Button size="lg" className="bg-maroon hover:bg-maroon/90 text-cream">
                Explore Antiques <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-1">Just In</p>
            <h2 className="font-serif text-4xl text-maroon">New Arrivals</h2>
          </div>
          <Link href="/shop" className="text-maroon hover:text-saffron font-medium inline-flex items-center gap-1 text-sm">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Devotees say</p>
          <h2 className="font-serif text-4xl md:text-5xl text-maroon">Blessed reviews from our family</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gold/20">
              <div className="flex gap-1 text-saffron mb-3">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-maroon/85 italic leading-relaxed">“{t.text}”</p>
              <div className="mt-4 pt-4 border-t border-gold/20">
                <div className="font-semibold text-maroon">{t.name}</div>
                <div className="text-xs text-maroon/60">{t.location} • {t.product}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative rounded-3xl overflow-hidden maroon-gradient p-8 md:p-14 text-center">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${IMG.marigold})`, backgroundSize: 'cover' }} />
          <div className="relative max-w-xl mx-auto text-cream">
            <Sparkles className="h-8 w-8 text-gold mx-auto mb-3" />
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-2">Join our devotional family</h3>
            <p className="opacity-90 mb-6">Get 10% off your first order plus festival updates, new arrivals and care tips.</p>
            <form onSubmit={subscribeNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email" required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-cream border-gold/40 text-maroon placeholder:text-maroon/50"
              />
              <Button type="submit" className="bg-gold text-maroon hover:bg-gold/90 font-semibold">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
