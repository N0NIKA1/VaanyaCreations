import Link from 'next/link';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-maroon text-cream mt-20">
      {/* Trust badges */}
      <div className="border-b border-[#C89B3C]/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { title: 'Handcrafted', sub: 'By skilled artisans' },
              { title: 'Quality Checked', sub: 'Personally inspected' },
              { title: 'Easy Exchange', sub: '7-day exchange' },
              { title: 'Ships Worldwide', sub: 'India & International' },
            ].map((b) => (
              <div key={b.title}>
                <div className="font-serif text-lg text-gold">{b.title}</div>
                <div className="text-xs opacity-80 mt-1">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-11 h-11 rounded-full gold-gradient flex items-center justify-center">
                <span className="font-serif text-white text-2xl font-bold">V</span>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-gold">Vanya</div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-cream/80">Handicrafts</div>
              </div>
            </div>
            <p className="text-sm text-cream/80 leading-relaxed">
              Handcrafted deity dresses, brass idols, and antique puja items — lovingly made by Indian artisans, delivered to devotees worldwide.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon transition"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon transition"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="w-9 h-9 rounded-full border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-maroon transition"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-serif text-gold text-lg mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/deity/laddu-gopal" className="hover:text-saffron">Laddu Gopal Poshak</Link></li>
              <li><Link href="/deity/radha-krishna" className="hover:text-saffron">Radha Krishna Vastra</Link></li>
              <li><Link href="/deity/mata-rani" className="hover:text-saffron">Mata Rani Shringar</Link></li>
              <li><Link href="/shop?category=antiques" className="hover:text-saffron">Brass Antiques</Link></li>
              <li><Link href="/shop?category=puja-items" className="hover:text-saffron">Puja Items</Link></li>
              <li><Link href="/shop" className="hover:text-saffron">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-gold text-lg mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li><Link href="/about" className="hover:text-saffron">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-saffron">Contact</Link></li>
              <li><a href="#" className="hover:text-saffron">Track Order</a></li>
              <li><a href="#" className="hover:text-saffron">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-saffron">Returns & Exchange</a></li>
              <li><a href="#" className="hover:text-saffron">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-gold text-lg mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> care@vanyahandicrafts.com</li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> +91 98765 43210</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> Vrindavan, Uttar Pradesh, India</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C89B3C]/30">
        <div className="container mx-auto px-4 py-5 text-center text-xs text-cream/60">
          © {new Date().getFullYear()} Vanya Handicrafts. All rights reserved. Made with devotion in Bharat 🛡️
        </div>
      </div>
    </footer>
  );
}
