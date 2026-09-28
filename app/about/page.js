'use client';

import Link from 'next/link';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Sparkles, Users, Globe } from 'lucide-react';
import { IMG } from '@/lib/products-data';

function App() {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-maroon">
        <img src={IMG.marigold} alt="Marigold" className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="container mx-auto px-4 py-20 md:py-28 relative text-center">
          <Sparkles className="h-8 w-8 text-gold mx-auto mb-4" />
          <p className="text-gold font-semibold uppercase tracking-widest text-sm mb-3">Our Story</p>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-cream">Made in devotion,<br />shipped with love</h1>
          <p className="text-cream/90 text-lg mt-4 max-w-2xl mx-auto">
            Vaanya Creation 5 is a small studio of Indian artisans hand-crafting Poshak, Shringar, and heirloom brass pieces for devotees around the world.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">
          <div>
            <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Since our first stitch</p>
            <h2 className="font-serif text-4xl text-maroon leading-tight">A tradition passed hand to hand</h2>
            <div className="space-y-4 mt-5 text-maroon/85 leading-relaxed">
              <p>Vaanya Creation 5 began in a small workshop in Vrindavan, where three generations of a weaving family had been stitching poshak for Laddu Gopal in their own home mandirs. What began as seva for their Aradhya became a calling to help other devotees adorn their deities with the same love and care.</p>
              <p>Today we work with over 120 artisan families across Vrindavan, Moradabad, Jaipur and Kumbakonam — each specializing in a specific craft: silk poshak, brass casting, wood carving, or zari embroidery.</p>
              <p>Every piece that leaves our studio is inspected, blessed at the local mandir, and shipped to devotees in India and 25+ countries around the world.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={IMG.krishnaBronze} alt="Krishna" className="rounded-2xl aspect-[3/4] object-cover shadow-lg" />
            <img src={IMG.brassCollection} alt="Brass" className="rounded-2xl aspect-[3/4] object-cover shadow-lg mt-6" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-y border-gold/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">What guides us</p>
            <h2 className="font-serif text-4xl text-maroon">Our devotional values</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Heart, title: 'Made with Bhakti', desc: 'Every piece begins with prayer, ends with a blessing.' },
              { icon: Users, title: 'Artisan-first', desc: 'Fair wages and long-term partnerships with 120+ families.' },
              { icon: Sparkles, title: 'Real materials', desc: 'Pure silk, solid brass, sheesham wood — no shortcuts.' },
              { icon: Globe, title: 'Global family', desc: 'Devotees in 25+ countries entrust us with their seva.' },
            ].map((v, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-saffron/15 flex items-center justify-center mx-auto">
                  <v.icon className="h-6 w-6 text-saffron" />
                </div>
                <h3 className="font-serif text-xl text-maroon mt-4">{v.title}</h3>
                <p className="text-sm text-maroon/70 mt-2">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-maroon">Adorn your Aradhya today</h2>
        <p className="text-maroon/70 mt-3 max-w-lg mx-auto">Explore our handcrafted collection of deity dresses, brass idols and puja treasures.</p>
        <Link href="/shop" className="inline-block mt-6">
          <Button size="lg" className="bg-maroon hover:bg-maroon/90 text-cream">Shop the Collection <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </section>

      <Footer />
    </div>
  );
}

export default App;
