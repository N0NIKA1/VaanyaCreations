'use client';

import PolicyLayout, { Section } from '@/components/site/PolicyLayout';

function App() {
  return (
    <PolicyLayout
      eyebrow="Support"
      title="Returns & Exchange"
      intro="A simple 7-day window, because the right fit matters for seva."
    >
      <Section heading="7-day exchange window">
        <p>Raise an exchange or return request within 7 days of delivery. Share an unboxing photo or video of the piece so we can process it quickly.</p>
      </Section>

      <Section heading="What qualifies">
        <ul className="list-disc pl-5 space-y-1">
          <li>Wrong size received or size does not fit your idol</li>
          <li>Damaged, torn or defective piece</li>
          <li>Wrong product or missing item in a combo pack</li>
        </ul>
      </Section>

      <Section heading="What we cannot accept">
        <ul className="list-disc pl-5 space-y-1">
          <li>Used, washed or altered poshak</li>
          <li>Clearance Sale and Under ₹299 items</li>
          <li>Customised or made-to-measure orders</li>
          <li>Requests raised after 7 days of delivery</li>
        </ul>
      </Section>

      <Section heading="How to request">
        <p>Message us on WhatsApp or write from the <a href="/contact" className="text-rosedeep underline">Contact</a> page with your order ID and photos. Once approved, we arrange a reverse pickup wherever the courier serves; otherwise a self-ship refund is offered.</p>
      </Section>

      <Section heading="Refunds">
        <p>Approved refunds are credited to the original payment method within 5–7 working days of the returned parcel reaching us. COD refunds are sent via bank transfer or UPI.</p>
      </Section>
    </PolicyLayout>
  );
}

export default App;
