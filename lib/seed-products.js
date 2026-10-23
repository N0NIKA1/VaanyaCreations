// SERVER-ONLY. Imported by the API route to seed MongoDB.
// Source: lib/catalog.json — real Devastram catalogue (505 products / 62 collections).
// Never import this from a client component: it would ship ~550KB to the browser.

import catalog from './catalog.json';
import { CATEGORY_LABELS } from './nav-data';

/** deterministic pseudo-random so SSR and client always agree */
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const COLOR_WORDS = ['Red', 'Pink', 'Rose', 'Peach', 'Yellow', 'Green', 'Blue', 'White', 'Cream', 'Ivory',
  'Black', 'Purple', 'Lavender', 'Orange', 'Golden', 'Silver', 'Maroon', 'Mint', 'Teal', 'Grey', 'Multi'];

const FABRIC_WORDS = ['Silk', 'Net', 'Velvet', 'Woollen', 'Cotton', 'Satin', 'Brocade', 'Tissue', 'Organza', 'Chanderi'];

function pick(words, text) {
  const t = text.toLowerCase();
  return words.find((w) => t.includes(w.toLowerCase())) || null;
}

export const PRODUCTS = catalog.products.map((p) => {
  const h = hash(p.id);
  const blob = `${p.name} ${p.description} ${(p.tags || []).join(' ')} ${p.productType}`;
  const isDress = p.category === 'poshak';
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    mrp: p.mrp || null,
    deity: p.deity,
    category: p.category,
    categoryName: CATEGORY_LABELS[p.category] || p.category,
    subcategory: p.category,
    productType: p.productType,
    collection: p.collections[0],
    collections: p.collections,
    images: p.images,
    description: p.description,
    sizes: p.sizes?.length ? p.sizes : (isDress ? ['0', '1', '2', '3', '4', '5', '6'] : ['Standard']),
    color: pick(COLOR_WORDS, blob) || 'Multi',
    fabric: pick(FABRIC_WORDS, blob) || (isDress ? 'Silk blend' : 'Premium finish'),
    materials: isDress ? 'Fabric, pearl & stone embellishments' : 'Premium alloy / fabric with fine detailing',
    care: isDress ? 'Dry clean or gentle hand wash' : 'Wipe gently with a dry cloth',
    occasion: (p.tags || []).includes('newin') ? 'Festive' : 'Daily seva',
    tags: p.tags || [],
    inStock: p.inStock !== false,
    rating: Number((4.4 + (h % 6) / 10).toFixed(1)),
    reviews: 12 + (h % 240),
    bestSeller: !!p.bestSeller,
    isNew: !!p.isNew,
  };
});

export const COLLECTION_INDEX = catalog.collections;

/** Changes whenever product count, prices or stock flags change — drives re-seeding. */
export const CATALOG_SIGNATURE = `${PRODUCTS.length}-${PRODUCTS.reduce(
  (acc, p) => acc + p.price + (p.mrp || 0) + (p.inStock ? 1 : 0), 0
)}`;
