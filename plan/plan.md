# Vaanya Creations 5 — Logo Rollout & Brand Colour Rebrand

The uploaded butterfly-script logo becomes the site's official mark, shown in the header, footer, favicon and admin login.
The whole storefront's colour palette shifts from saffron/gold to the logo's wine, rose and ivory scheme.

## Who it's for

- Devotees and gifting buyers shopping for deity poshak, vastra and handmade antiques
- The brand owner, who wants the website to look like one continuous identity with the logo, packaging and social profiles
- International visitors, for whom a softer, premium palette reads as boutique rather than generic festive

## Core features and experience

**Logo placement**
- Header: logo mark + wordmark, sized for desktop and trimmed to a compact version on mobile so the nav stays usable
- Footer: logo on the ivory/wine footer band with the tagline beneath
- Browser tab favicon and the mobile home-screen icon
- Admin login screen and admin sidebar header
- Social/share preview image so links shared on WhatsApp and Instagram show the logo card

**Colour system replacing saffron/gold**
- Deep wine (`#7A0C2E`-family) as the primary — buttons, links, active states, price labels, headings
- Rose / blush pinks as the secondary and accent — badges, hover washes, section tints, sale chips
- Ivory-cream (`#F7F8EC`-family) as the page background, matching the logo's backdrop
- Muted plum for borders, dividers and subdued text
- Gold retained only as a thin, optional trim on premium/bestseller badges — no longer a dominant colour

**Surfaces that get recoloured**
- Home: hero, collection tiles, pill tabs, carousels, trust strip, newsletter band
- Shop and collection pages: filter chips, sort control, pagination, product cards, MRP strike-through, discount badges
- Product detail: gallery thumbnails, size/colour swatch selection, Add-to-Cart and Buy-Now
- Cart, checkout, About, Blog, Contact, Policies
- Admin dashboard: tabs, tables, dialogs, primary/destructive buttons

**Consistency guardrails**
- Text-on-colour contrast checked so wine buttons and rose badges stay readable
- Devastram-style layout untouched — pill tabs, side-scrolling carousels and clean cards keep their structure, only their colours change
- One palette source so future changes are a single edit, not a page-by-page hunt

## User flow

1. Visitor lands on the home page and sees the butterfly logo top-left on an ivory background
2. Wine buttons and rose accents carry the eye through collections into a product page
3. Adding to cart and moving to checkout keeps the same wine/rose language, so the brand never "switches skin"
4. Footer and tab favicon close the loop with the same mark
5. Owner signs into the admin panel and sees the same logo and palette there

## UI/UX feel

Soft, feminine-premium and devotional rather than loud festive. Ivory space, thin wine rules, watercolour-rose touches — the calm of a boutique gifting brand. Serif display headings paired with a clean body face, generous whitespace, and mobile-first spacing. Restrained motion: gentle hovers and fades, no bounce.

## Implementation phases

**Phase 1 — MVP (built now)**
- Logo asset added and wired into header, footer, favicon, share preview, admin login and admin header
- Full palette swap across storefront and admin via a single theme definition
- Contrast and mobile checks on home, shop, collection, product, cart, checkout and admin

**Phase 2 — Brand polish**
- Logo-derived watercolour petal motifs as section dividers and empty-state art
- Optional dark/evening variant of the palette
- Refined typography pairing and a printable brand sheet (hex codes, logo spacing rules)

**Phase 3 — Deferred (already on the backlog)**
- Finish the multi-upload / drag-and-drop admin Image Manager
- English/Hindi toggle
- Razorpay (domestic) and PayPal (international) checkout

## Assumptions

- Colours are read from the uploaded logo: wine `#7A0C2E`, rose `#E8A9B8`, blush `#F3C8C0`, plum `#6E4A63`, ivory `#F7F8EC`
- Wine becomes the primary action colour; saffron/orange is removed from the palette entirely
- Gold survives only as a minor badge trim, not as a background or button colour
- The logo is used as supplied, with only background trimming/transparency for header use — no redraw, recolour or text edit
- Brand name stays "Vaanya Creation 5" as currently written in the site copy; the logo's own wordmark reads "Vaanya Creations 5" and is shown as-is
- Light mode only for now
- Existing layouts, product data and page structure remain unchanged; this is a visual rebrand, not a redesign
