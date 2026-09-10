'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function App() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Message received!', { description: 'We will get back to you within 24 hours.' });
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        toast.error('Something went wrong');
      }
    } catch {
      toast.error('Network error. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-saffron font-semibold uppercase tracking-widest text-sm mb-2">Get in Touch</p>
          <h1 className="font-serif text-4xl md:text-5xl text-maroon">We're here to help</h1>
          <p className="text-maroon/70 mt-3">Questions about a product, custom order, or shipping? Reach out — we typically respond within 24 hours.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gold/30 shadow-md">
            <h2 className="font-serif text-2xl text-maroon mb-6">Send us a message</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-maroon">Your Name*</Label>
                <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-cream border-gold/40 mt-1" />
              </div>
              <div>
                <Label htmlFor="email" className="text-maroon">Email*</Label>
                <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-cream border-gold/40 mt-1" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-maroon">Phone (optional)</Label>
                <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-cream border-gold/40 mt-1" />
              </div>
              <div>
                <Label htmlFor="message" className="text-maroon">Message*</Label>
                <Textarea id="message" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-cream border-gold/40 mt-1" />
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="w-full bg-maroon hover:bg-maroon/90 text-cream">
                {submitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-gold/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron/15 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-maroon">Email</h3>
                  <a href="mailto:care@vanyahandicrafts.com" className="text-maroon/80 hover:text-saffron">care@vanyahandicrafts.com</a>
                  <p className="text-xs text-maroon/60 mt-1">For orders, custom requests, wholesale inquiries</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gold/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron/15 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-maroon">Phone</h3>
                  <a href="tel:+919876543210" className="text-maroon/80 hover:text-saffron">+91 98765 43210</a>
                  <p className="text-xs text-maroon/60 mt-1">Mon-Sat, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
            </div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="block">
              <div className="bg-green-600 hover:bg-green-700 transition text-white rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg">WhatsApp Chat</h3>
                    <p className="text-white/90">Instant support — chat with us</p>
                    <p className="text-xs text-white/70 mt-1">Fastest way to reach us</p>
                  </div>
                </div>
              </div>
            </a>
            <div className="bg-white rounded-2xl p-6 border border-gold/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron/15 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-maroon">Studio</h3>
                  <p className="text-maroon/80">Vrindavan, Uttar Pradesh, India</p>
                  <p className="text-xs text-maroon/60 mt-1">By appointment only</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gold/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron/15 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-saffron" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-maroon">Business Hours</h3>
                  <p className="text-maroon/80 text-sm">Mon – Sat: 10:00 AM – 7:00 PM IST</p>
                  <p className="text-maroon/80 text-sm">Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default App;
