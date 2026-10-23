// Navigation + taxonomy for Vaanya Creation 5.
// Structure mirrors the live devastram.com menu tree (New In & Bestsellers → Support),
// mapped onto internal /collection/<handle> routes. Tile images and counts come from
// collections-meta.js (auto-generated from the imported catalogue).

import { COLLECTIONS } from './collections-meta';
import { DEITY_FACETS, CATEGORY_FACETS } from './facets-meta';

export { COLLECTIONS };

/** Build a nav leaf for a collection handle. Returns null when the collection is empty. */
const c = (handle, label) => {
  const meta = COLLECTIONS[handle];
  if (!meta) return null;
  return {
    label: label || meta.title,
    href: `/collection/${handle}`,
    handle,
    image: meta.image,
    count: meta.count,
  };
};

/** Drop empty/missing collections so the menu never links to a dead page. */
const list = (...items) => items.filter(Boolean);

const group = (label, items, href) => ({ label, href, children: list(...items) });

export const NAV = list(
  {
    label: 'Shop by Deity',
    children: list(
      group('Laddu Gopal Dresses', [
        c('pastel-laddu', 'Soft Pastel Edit'),
        c('laddu-gopal-designer', 'Designer Dresses'),
        c('luxe-laddu', 'Luxe Edit'),
        c('summer-laddu-gopal', 'Summer Collection'),
        c('bedding-set', 'Summer Bedding Set'),
        c('woollen-laddu', 'Woollen Dresses'),
        c('laddu-velvet', 'Velvet Laddu Gopal Dresses'),
        c('laddu-gopal-chatri', 'Chatri / Umbrella'),
      ], '/deity/laddu-gopal'),
      c('radha-rani', 'Radha Rani Dresses'),
      group('Mata Rani Dresses', [
        c('summer-mata', 'Summer Collection'),
        c('pastel-mata', 'Soft Pastel Edit'),
        c('lehenga-patka', 'Lehenga & Patka'),
        c('mata-rani', 'Designer Mata Rani Dresses'),
        c('luxe-mata', 'Luxe Edit'),
        c('velvet-mata', 'Velvet Mata Rani Dresses'),
        c('woollen-mata', 'Woollen Mata Rani Dresses'),
      ], '/deity/mata-rani'),
      group('RK Set / Yugal Sarkar / Laxmi ji & Ganesh ji Dresses', [
        c('summer-rk', 'Summer Collection'),
        c('pastel-rk', 'Soft Pastel Edit'),
        c('designer-rk', 'Designer RK / Yugal Sarkar Dresses'),
        c('rk-set-yugal-sarkar-laxmi-ji-ganesh-ji-dresses', 'All RK / Laxmi ji & Ganesh ji Dresses'),
        c('luxe-rk', 'Luxe Edit'),
        c('velvet-rk', 'Velvet Radhe Krishna Dresses'),
        c('woollen-rk', 'Woollen Radhe Krishna Dresses'),
      ], '/deity/radha-krishna'),
      c('dhoti-patka', 'Dhoti & Patka'),
      c('matching-set', 'Mandir Matching Set'),
      c('shiv-dress', 'Shiv Parivar Dress'),
      c('hanuman-dress', 'Hanuman Ji Dresses'),
      c('sai-baba', 'Sai Baba Dresses'),
    ),
  },

  c('newin-bestsellers', 'New Arrivals & Bestsellers'),

  c('devotee-collection', 'Devotee Favourites'),

  group('Luxe Edit', [
    c('luxe-laddu', 'Luxe Laddu Gopal Dress'),
    c('luxe-mata', 'Luxe Mata Rani Dress'),
    c('luxe-rk', 'Luxe RK Dress'),
    c('shringar-set', 'Luxe Shringar Jewellery Set'),
    c('luxe-necklace', 'Luxe Necklace'),
    c('luxe-mukut', 'Luxe Mukut'),
    c('luxe-kangan', 'Luxe Kangan'),
    c('luxe-bansuri', 'Luxe Bansuri'),
  ]),

  {
    label: 'Shringar & Accessories',
    children: list(
      c('under-299', 'Under ₹299'),
      c('chandan', 'Puja Items'),
      group('Necklace / Haar', [
        c('necklace', 'Daily Wear Necklace'),
        c('luxe-necklace', 'Luxe Necklace'),
      ], '/collection/necklace'),
      group('Kangan', [
        c('kangana', 'Designer Kangan'),
        c('luxe-kangan', 'Luxe Kangan'),
      ], '/collection/kangana'),
      group('Bansuri', [
        c('bansuri', 'Designer Bansuri'),
        c('luxe-bansuri', 'Luxe Bansuri'),
      ], '/collection/bansuri'),
      group('Mukut', [
        c('mukut', 'Daily Wear Mukut'),
        c('luxe-mukut', 'Luxe Mukut'),
      ], '/collection/mukut'),
      c('earrings', 'Earrings'),
      c('maang-tika', 'Maang Tika'),
      c('chandrika', 'Chandrika'),
      c('kamar-band', 'Kamar Band'),
      c('trishul', 'Trishul'),
      c('payal', 'Payal'),
      c('bag', 'Bag'),
      c('hairs', 'Hairs'),
      c('chattar', 'Chattar'),
      c('attar', 'Attar / Ittar'),
      c('laddu-gopal-chatri', 'Umbrella'),
      group('All Jewellery Collection', [
        c('luxe-jewellery-collection-copy', 'Luxe Jewellery Collection'),
        c('designer-jewellery-collection-copy', 'Designer Jewellery Collection'),
      ]),
    ),
  },

  c('under-299', 'Budget Buys Under ₹299'),
  c('clearance-sale', 'Sale'),

  group('Wedding & Gifting', [
    c('envelope', 'Cash Envelopes'),
    c('tissue-potli', 'Dry Fruit Potlies'),
    c('glam-potlies', 'Glam Potlies'),
    c('trendy-gift-bags', 'Trendy Gift Bags'),
    c('zip-pouches', 'Clutches & Zippers'),
  ]),

  group('Festive Home Décor', [
    c('candles', 'Decorative Diyas & Tealight Candle Holder'),
    c('shubh-labh', 'Shubh Labh'),
    c('toran-bandhanwal', 'Torans / Bandhanwal'),
  ]),

  {
    label: 'Help & Support',
    children: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Returns & Exchange', href: '/returns' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'About Us', href: '/about' },
    ],
  },
);

/* ---------------------------------------------------------------- taxonomy */

export const CATEGORY_LABELS = {
  poshak: 'Poshak & Dresses',
  jewellery: 'Jewellery & Shringar',
  wedding: 'Wedding & Gifting',
  'home-decor': 'Festive Home Decor',
  puja: 'Puja Essentials',
  accessories: 'Accessories',
};

export const CATEGORIES = Object.keys(CATEGORY_FACETS).map((slug) => ({
  slug,
  name: CATEGORY_LABELS[slug] || slug,
  image: CATEGORY_FACETS[slug].image,
  count: CATEGORY_FACETS[slug].count,
}));

const DEITY_DEFS = [
  { slug: 'laddu-gopal', name: 'Laddu Gopal', tagline: 'Poshak, shringar & bedding for baby Krishna', tile: 'laddu-gopal-designer', hub: '/deity/laddu-gopal' },
  { slug: 'radha-krishna', name: 'Radha Krishna', tagline: 'RK set, Yugal Sarkar, Laxmi ji & Ganesh ji', tile: 'designer-rk', hub: '/deity/radha-krishna' },
  { slug: 'mata-rani', name: 'Mata Rani', tagline: 'Lehenga, chunri & designer poshak', tile: 'mata-rani', hub: '/deity/mata-rani' },
  { slug: 'radha-rani', name: 'Radha Rani', tagline: 'Graceful poshak for Radha Rani', tile: 'radha-rani', hub: '/collection/radha-rani' },
  { slug: 'hanuman', name: 'Hanuman Ji', tagline: 'Bajrangbali dhoti & vastra', tile: 'hanuman-dress', hub: '/collection/hanuman-dress' },
  { slug: 'shiv-parivar', name: 'Shiv Parivar', tagline: 'Family shringar sets', tile: 'shiv-dress', hub: '/collection/shiv-dress' },
  { slug: 'sai-baba', name: 'Sai Baba', tagline: 'Simple, serene vastra', tile: 'sai-baba', hub: '/collection/sai-baba' },
];

export const DEITIES = DEITY_DEFS.map((d) => ({
  slug: d.slug,
  name: d.name,
  tagline: d.tagline,
  hub: d.hub,
  count: DEITY_FACETS[d.slug]?.count || 0,
  image: COLLECTIONS[d.tile]?.image || DEITY_FACETS[d.slug]?.image || '',
}));

const DEITY_COLLECTIONS = {
  'laddu-gopal': ['pastel-laddu', 'laddu-gopal-designer', 'luxe-laddu', 'summer-laddu-gopal', 'bedding-set', 'woollen-laddu', 'laddu-velvet', 'laddu-gopal-chatri'],
  'radha-krishna': ['summer-rk', 'pastel-rk', 'designer-rk', 'luxe-rk', 'velvet-rk', 'woollen-rk', 'rk-set-yugal-sarkar-laxmi-ji-ganesh-ji-dresses'],
  'mata-rani': ['summer-mata', 'pastel-mata', 'lehenga-patka', 'mata-rani', 'luxe-mata', 'velvet-mata', 'woollen-mata'],
  'radha-rani': ['radha-rani'],
  hanuman: ['hanuman-dress'],
  'shiv-parivar': ['shiv-dress'],
  'sai-baba': ['sai-baba'],
};

export const DEITY_META = Object.fromEntries(
  Object.entries(DEITY_COLLECTIONS).map(([slug, handles]) => [
    slug,
    {
      subcategories: (DEITY_FACETS[slug]?.categories || []).map((cat) => ({
        slug: cat,
        name: CATEGORY_LABELS[cat] || cat,
      })),
      collections: handles
        .filter((h) => COLLECTIONS[h])
        .map((h) => ({ slug: h, name: COLLECTIONS[h].title, image: COLLECTIONS[h].image, count: COLLECTIONS[h].count })),
    },
  ])
);

/* ------------------------------------------------------------------ lookups */

/** Flat list of every collection leaf reachable from the menu. */
export const flattenNav = (items = NAV, acc = []) => {
  items.forEach((it) => {
    if (it.handle) acc.push(it);
    if (it.children) flattenNav(it.children, acc);
  });
  return acc;
};

/** Sibling collections of a handle, used for the "explore more" tiles. */
export function siblingCollections(handle) {
  const walk = (items, parents) => {
    for (const it of items) {
      if (it.children) {
        const hit = it.children.some((ch) => ch.handle === handle);
        if (hit) return it.children.filter((ch) => ch.handle && ch.handle !== handle);
        const deeper = walk(it.children, [...parents, it]);
        if (deeper) return deeper;
      }
    }
    return null;
  };
  return walk(NAV, []) || [];
}

/** Human-readable breadcrumb trail for a collection handle. */
export function collectionTrail(handle) {
  const trail = [];
  const walk = (items, path) => {
    for (const it of items) {
      if (it.handle === handle) {
        trail.push(...path, it);
        return true;
      }
      if (it.children && walk(it.children, [...path, it])) return true;
    }
    return false;
  };
  walk(NAV, []);
  return trail;
}
