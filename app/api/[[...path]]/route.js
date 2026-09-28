import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { PRODUCTS, DEITIES, CATEGORIES, DEITY_META } from '@/lib/products-data';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'vaanya-admin-2025';
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_UPLOAD_BYTES = 6 * 1024 * 1024; // 6 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

let clientPromise;
function getClient() {
  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGO_URL);
    clientPromise = client.connect();
  }
  return clientPromise;
}

async function getDb() {
  const client = await getClient();
  const dbName = process.env.DB_NAME || 'vaanya_creation_5';
  return client.db(dbName);
}

async function ensureSeed() {
  const db = await getDb();
  const count = await db.collection('products').countDocuments();
  const seedFlag = await db.collection('_meta').findOne({ _id: 'seed_version' });
  const currentVersion = 'v4-' + PRODUCTS.length;
  // Re-seed whenever version changes, but preserve admin-created products
  if (count === 0 || seedFlag?.value !== currentVersion) {
    await db.collection('products').deleteMany({ adminCreated: { $ne: true } });
    await db.collection('products').insertMany(PRODUCTS.map((p) => ({ ...p, _id: p.id })));
    await db.collection('_meta').updateOne({ _id: 'seed_version' }, { $set: { value: currentVersion } }, { upsert: true });
  }
  return db;
}

function json(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

function requireAdmin(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token === ADMIN_PASSWORD;
}

export async function OPTIONS() {
  return json({});
}

// ================= GET =================
export async function GET(request, { params }) {
  const resolvedParams = await params;
  const p = resolvedParams?.path || [];
  const url = new URL(request.url);

  try {
    if (p.length === 0) return json({ message: 'Vaanya Creation 5 API', version: '2.0' });
    if (p[0] === 'deities') return json({ deities: DEITIES });
    if (p[0] === 'categories') return json({ categories: CATEGORIES });

    if (p[0] === 'deity-meta' && p.length === 2) {
      const meta = DEITY_META[p[1]] || { subcategories: [], collections: [] };
      return json(meta);
    }

    if (p[0] === 'products' && p.length === 1) {
      const db = await ensureSeed();
      const q = {};
      const filters = ['deity', 'category', 'subcategory', 'collection'];
      filters.forEach((f) => { const v = url.searchParams.get(f); if (v) q[f] = v; });
      if (url.searchParams.get('bestSeller') === 'true') q.bestSeller = true;
      if (url.searchParams.get('isNew') === 'true') q.isNew = true;
      const priceMin = url.searchParams.get('priceMin');
      const priceMax = url.searchParams.get('priceMax');
      if (priceMin || priceMax) {
        q.price = {};
        if (priceMin) q.price.$gte = parseInt(priceMin);
        if (priceMax) q.price.$lte = parseInt(priceMax);
      }
      const search = url.searchParams.get('search');
      if (search) q.name = { $regex: search, $options: 'i' };
      const sort = url.searchParams.get('sort') || 'popular';
      const sortMap = { popular: { reviews: -1 }, newest: { isNew: -1 }, 'price-asc': { price: 1 }, 'price-desc': { price: -1 } };
      const limit = parseInt(url.searchParams.get('limit') || '0');
      let cursor = db.collection('products').find(q).sort(sortMap[sort] || sortMap.popular);
      if (limit > 0) cursor = cursor.limit(limit);
      const products = await cursor.toArray();
      return json({ products: products.map(({ _id, ...x }) => x), total: products.length });
    }

    if (p[0] === 'products' && p.length === 2) {
      const db = await ensureSeed();
      const product = await db.collection('products').findOne({ id: p[1] });
      if (!product) return json({ error: 'Product not found' }, 404);
      const { _id, ...rest } = product;
      const related = await db.collection('products').find({
        $or: [{ deity: product.deity, id: { $ne: product.id } }, { category: product.category, id: { $ne: product.id } }],
      }).limit(4).toArray();
      return json({ product: rest, related: related.map(({ _id, ...x }) => x) });
    }

    // Coupons (public — used by cart)
    if (p[0] === 'coupons' && p.length === 1) {
      const db = await getDb();
      const list = await db.collection('coupons').find({ active: true }).toArray();
      return json({ coupons: list.map(({ _id, ...c }) => c) });
    }

    // Validate a specific coupon
    if (p[0] === 'coupons' && p.length === 2 && p[1] !== 'admin') {
      const db = await getDb();
      const code = p[1].toUpperCase();
      const coupon = await db.collection('coupons').findOne({ code, active: true });
      if (!coupon) return json({ valid: false, error: 'Invalid or expired coupon' }, 404);
      const { _id, ...rest } = coupon;
      return json({ valid: true, coupon: rest });
    }

    // ================= ADMIN GET =================
    if (p[0] === 'admin') {
      if (!requireAdmin(request)) return json({ error: 'Unauthorized' }, 401);
      const db = await getDb();
      if (p[1] === 'products') {
        const list = await db.collection('products').find({}).toArray();
        return json({ products: list.map(({ _id, ...x }) => x), total: list.length });
      }
      if (p[1] === 'coupons') {
        const list = await db.collection('coupons').find({}).sort({ createdAt: -1 }).toArray();
        return json({ coupons: list.map(({ _id, ...c }) => c) });
      }
      if (p[1] === 'orders') {
        const list = await db.collection('orders').find({}).sort({ createdAt: -1 }).limit(100).toArray();
        return json({ orders: list.map(({ _id, ...o }) => o) });
      }
      if (p[1] === 'messages') {
        const list = await db.collection('contact_messages').find({}).sort({ createdAt: -1 }).limit(100).toArray();
        return json({ messages: list.map(({ _id, ...m }) => m) });
      }
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('GET error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}

// ================= POST =================
export async function POST(request, { params }) {
  const resolvedParams = await params;
  const p = resolvedParams?.path || [];

  try {
    // Public endpoints
    if (p[0] === 'contact') {
      const body = await request.json();
      const db = await getDb();
      const doc = { id: crypto.randomUUID(), ...body, createdAt: new Date().toISOString() };
      await db.collection('contact_messages').insertOne(doc);
      return json({ success: true, id: doc.id });
    }
    if (p[0] === 'newsletter') {
      const body = await request.json();
      const db = await getDb();
      await db.collection('newsletter').insertOne({ id: crypto.randomUUID(), email: body.email, createdAt: new Date().toISOString() });
      return json({ success: true });
    }
    if (p[0] === 'orders') {
      const body = await request.json();
      const db = await getDb();
      const order = {
        id: 'VH-' + Date.now().toString(36).toUpperCase(),
        items: body.items || [],
        customer: body.customer || {},
        shipping: body.shipping || {},
        subtotal: body.subtotal || 0,
        total: body.total || 0,
        paymentMethod: body.paymentMethod || 'cod',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      await db.collection('orders').insertOne(order);
      return json({ success: true, order });
    }

    // ================= ADMIN =================
    if (p[0] === 'admin' && p[1] === 'login') {
      const body = await request.json();
      if (body.password === ADMIN_PASSWORD) {
        return json({ success: true, token: ADMIN_PASSWORD });
      }
      return json({ error: 'Invalid password' }, 401);
    }

    // All other admin routes require auth
    if (p[0] === 'admin' && !requireAdmin(request)) {
      return json({ error: 'Unauthorized' }, 401);
    }

    // POST /api/admin/upload — multipart/form-data file upload
    if (p[0] === 'admin' && p[1] === 'upload') {
      const form = await request.formData();
      const file = form.get('file');
      if (!file || typeof file === 'string') return json({ error: 'file required' }, 400);
      if (file.size > MAX_UPLOAD_BYTES) return json({ error: 'File too large (max 6MB)' }, 413);
      if (!ALLOWED_MIME.has(file.type)) return json({ error: 'Only JPG/PNG/WEBP allowed' }, 415);

      await mkdir(UPLOAD_DIR, { recursive: true });
      const ext = file.type === 'image/png' ? 'png' : (file.type === 'image/webp' ? 'webp' : 'jpg');
      const filename = `${crypto.randomUUID()}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(UPLOAD_DIR, filename), buffer);
      return json({ success: true, url: `/uploads/${filename}` });
    }

    // POST /api/admin/products — create new product
    if (p[0] === 'admin' && p[1] === 'products') {
      const body = await request.json();
      if (!body.name || !body.price) return json({ error: 'name and price required' }, 400);
      const db = await getDb();
      const id = body.id || 'adm-' + crypto.randomUUID().slice(0, 8);
      const product = {
        id, _id: id,
        name: body.name,
        price: parseInt(body.price),
        mrp: parseInt(body.mrp || body.price),
        deity: body.deity || null,
        category: body.category || 'dresses',
        subcategory: body.subcategory || 'poshak',
        collection: body.collection || null,
        fabric: body.fabric || '',
        color: body.color || '',
        occasion: body.occasion || 'All',
        sizes: Array.isArray(body.sizes) ? body.sizes : (body.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
        images: Array.isArray(body.images) ? body.images : [],
        description: body.description || '',
        materials: body.materials || '',
        care: body.care || '',
        inStock: body.inStock !== false,
        rating: parseFloat(body.rating) || 4.5,
        reviews: parseInt(body.reviews) || 0,
        bestSeller: !!body.bestSeller,
        isNew: body.isNew !== false,
        adminCreated: true,
        createdAt: new Date().toISOString(),
      };
      await db.collection('products').insertOne(product);
      await db.collection('_meta').updateOne({ _id: 'seed_version' }, { $set: { adminModified: true } }, { upsert: true });
      const { _id, ...rest } = product;
      return json({ success: true, product: rest });
    }

    // POST /api/admin/coupons — create coupon
    if (p[0] === 'admin' && p[1] === 'coupons') {
      const body = await request.json();
      if (!body.code) return json({ error: 'code required' }, 400);
      const db = await getDb();
      const coupon = {
        id: crypto.randomUUID(),
        code: body.code.toUpperCase(),
        discountPct: parseInt(body.discountPct) || 0,
        discountAmt: parseInt(body.discountAmt) || 0,
        minCartValue: parseInt(body.minCartValue) || 0,
        description: body.description || '',
        active: body.active !== false,
        createdAt: new Date().toISOString(),
      };
      try {
        await db.collection('coupons').insertOne(coupon);
      } catch (e) {
        if (e.code === 11000) return json({ error: 'Coupon code already exists' }, 409);
        throw e;
      }
      return json({ success: true, coupon });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('POST error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}

// ================= PATCH =================
export async function PATCH(request, { params }) {
  const resolvedParams = await params;
  const p = resolvedParams?.path || [];

  try {
    if (p[0] === 'admin' && !requireAdmin(request)) return json({ error: 'Unauthorized' }, 401);

    // PATCH /api/admin/products/:id — update product fields
    if (p[0] === 'admin' && p[1] === 'products' && p[2]) {
      const body = await request.json();
      const db = await getDb();
      const update = {};
      const allowedFields = ['name', 'price', 'mrp', 'deity', 'category', 'subcategory', 'collection', 'fabric', 'color', 'occasion', 'description', 'materials', 'care', 'bestSeller', 'isNew', 'inStock', 'images', 'sizes'];
      allowedFields.forEach((f) => { if (body[f] !== undefined) update[f] = body[f]; });
      if (Object.keys(update).length === 0) return json({ error: 'no valid fields' }, 400);
      const result = await db.collection('products').updateOne({ id: p[2] }, { $set: update });
      if (result.matchedCount === 0) return json({ error: 'Product not found' }, 404);
      await db.collection('_meta').updateOne({ _id: 'seed_version' }, { $set: { adminModified: true } }, { upsert: true });
      return json({ success: true });
    }

    // PATCH /api/admin/coupons/:code — toggle active
    if (p[0] === 'admin' && p[1] === 'coupons' && p[2]) {
      const body = await request.json();
      const db = await getDb();
      const update = {};
      if (body.active !== undefined) update.active = !!body.active;
      const result = await db.collection('coupons').updateOne({ code: p[2].toUpperCase() }, { $set: update });
      if (result.matchedCount === 0) return json({ error: 'Coupon not found' }, 404);
      return json({ success: true });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('PATCH error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}

// ================= DELETE =================
export async function DELETE(request, { params }) {
  const resolvedParams = await params;
  const p = resolvedParams?.path || [];

  try {
    if (p[0] === 'admin' && !requireAdmin(request)) return json({ error: 'Unauthorized' }, 401);

    if (p[0] === 'admin' && p[1] === 'products' && p[2]) {
      const db = await getDb();
      const result = await db.collection('products').deleteOne({ id: p[2] });
      if (result.deletedCount === 0) return json({ error: 'Product not found' }, 404);
      await db.collection('_meta').updateOne({ _id: 'seed_version' }, { $set: { adminModified: true } }, { upsert: true });
      return json({ success: true });
    }

    if (p[0] === 'admin' && p[1] === 'coupons' && p[2]) {
      const db = await getDb();
      const result = await db.collection('coupons').deleteOne({ code: p[2].toUpperCase() });
      if (result.deletedCount === 0) return json({ error: 'Coupon not found' }, 404);
      return json({ success: true });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('DELETE error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}
