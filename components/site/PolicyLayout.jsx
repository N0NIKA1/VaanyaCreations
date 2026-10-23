'use client';

import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function PolicyLayout({ eyebrow, title, intro, children }) {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <section className="bg-maroon">
        <div className="container mx-auto px-4 py-12 md:py-16 text-center">
          {eyebrow && (
            <p className="text-gold font-semibold uppercase tracking-widest text-[11px] mb-2">{eyebrow}</p>
          )}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-cream">{title}</h1>
          {intro && <p className="text-cream/85 max-w-2xl mx-auto mt-3 text-sm md:text-base">{intro}</p>}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gold/40 shadow-sm p-6 md:p-10">
          {children}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function Section({ heading, children }) {
  return (
    <div className="mb-8 last:mb-0">
      <h2 className="font-serif text-2xl text-maroon mb-3">{heading}</h2>
      <div className="text-[14.5px] text-plum leading-relaxed space-y-2">{children}</div>
    </div>
  );
}
