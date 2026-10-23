'use client';

import PolicyLayout from '@/components/site/PolicyLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'How do I choose the right size for my Laddu Gopal?',
    a: 'Measure your idol from the base to the top of the head (without mukut) in inches — that number is the size. A 4 inch idol takes size 4. If you are between sizes, go one size up.',
  },
  {
    q: 'What is included in a dress set?',
    a: 'Most poshak sets include the dress and pagdi/mukut cloth. Combo packs mention the exact inclusions on the product page — for example “Includes: Two Dress without Mukut”.',
  },
  {
    q: 'Do you make custom sizes or colours?',
    a: 'Yes. For bulk mandir orders or a specific colour theme, message us on WhatsApp with your idol size and festival date and we will share options and timelines.',
  },
  {
    q: 'Is Cash on Delivery available?',
    a: 'COD is available across India with a small handling fee. International orders are prepaid only.',
  },
  {
    q: 'How should I wash the poshak?',
    a: 'Gentle hand wash in cold water without detergent soaking, or dry clean for heavily embellished luxe pieces. Do not wring; dry in shade to protect the zari and stones.',
  },
  {
    q: 'Do you ship outside India?',
    a: 'Yes — we ship worldwide. Delivery is typically 7–14 working days and customs duties, if any, are payable by the recipient.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'Orders can be changed or cancelled before dispatch. Once the parcel is handed to the courier, the exchange policy applies instead.',
  },
  {
    q: 'Are the colours exactly as shown in photos?',
    a: 'We photograph in natural light with minimal editing, but a slight variation can appear across screens. Handmade embellishment placement may also vary a little from piece to piece.',
  },
];

function App() {
  return (
    <PolicyLayout
      eyebrow="Support"
      title="Frequently Asked Questions"
      intro="Sizes, shipping, care and customisation — answered."
    >
      <Accordion type="single" collapsible className="w-full">
        {FAQS.map((f, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-gold/50">
            <AccordionTrigger className="text-left font-serif text-lg text-maroon hover:text-rosedeep">
              {f.q}
            </AccordionTrigger>
            <AccordionContent className="text-[14.5px] text-plum leading-relaxed">
              {f.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PolicyLayout>
  );
}

export default App;
