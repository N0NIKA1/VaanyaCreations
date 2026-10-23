'use client';

import PolicyLayout, { Section } from '@/components/site/PolicyLayout';

function App() {
  return (
    <PolicyLayout
      eyebrow="Support"
      title="Shipping & Delivery"
      intro="Every poshak is packed with care and dispatched from our Vrindavan studio."
    >
      <Section heading="Dispatch time">
        <p>Ready-to-ship pieces leave our studio within 1–2 working days. Made-to-order poshak and luxe sets take 4–7 working days as they are stitched and embellished by hand.</p>
      </Section>

      <Section heading="Delivery within India">
        <ul className="list-disc pl-5 space-y-1">
          <li>Metro cities: 2–4 working days after dispatch</li>
          <li>Rest of India: 4–7 working days after dispatch</li>
          <li>Free shipping on prepaid orders above ₹999</li>
          <li>Cash on Delivery available across India (₹49 handling fee)</li>
        </ul>
      </Section>

      <Section heading="International delivery">
        <p>We ship worldwide — USA, UK, Canada, Australia, UAE, Singapore and more. International orders are prepaid only and usually arrive in 7–14 working days. Duties and customs charges, where applicable, are payable by the recipient.</p>
      </Section>

      <Section heading="Tracking">
        <p>A tracking link is shared over WhatsApp and email as soon as your parcel leaves us. You can also check status any time on our <a href="/track-order" className="text-rosedeep underline">Track Order</a> page.</p>
      </Section>

      <Section heading="Packaging">
        <p>Dresses are wrapped in butter paper inside a rigid box, jewellery in pouches with bubble protection, so the shringar reaches you exactly as it left the studio.</p>
      </Section>
    </PolicyLayout>
  );
}

export default App;
