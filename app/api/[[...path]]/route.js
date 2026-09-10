import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { PRODUCTS, DEITIES, CATEGORIES, LADDU_GOPAL_SUBCATEGORIES, LADDU_GOPAL_COLLECTIONS } from '@/lib/products-data';

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
  const dbName = process.env.DB_NAME || 'vanya_handicrafts';
  return client.db(dbName);
}

async function ensureSeed() {
  const db = await getDb();
  const count = await db.collection('products').countDocuments();
  // If catalog size changed, wipe and reseed
  if (count !== PRODUCTS.length) {
    await db.collection('products').deleteMany({});
    await db.collection('products').insertMany(PRODUCTS.map((p) => ({ ...p, _id: p.id })));
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

export async function OPTIONS() {
  return json({});
}

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const path = resolvedParams?.path || [];
  const url = new URL(request.url);

  try {
    if (path.length === 0) {
      return json({ message: 'Vanya Handicrafts API', version: '1.1' });
    }

    if (path[0] === 'deities' && path.length === 1) {
      return json({ deities: DEITIES });
    }

    if (path[0] === 'categories' && path.length === 1) {
      return json({ categories: CATEGORIES });
    }

    // GET /api/deity-meta/:slug — returns subcategories and collections for a deity
    if (path[0] === 'deity-meta' && path.length === 2) {
      if (path[1] === 'laddu-gopal') {
        return json({
          subcategories: LADDU_GOPAL_SUBCATEGORIES,
          collections: LADDU_GOPAL_COLLECTIONS,
        });
      }
      return json({ subcategories: [], collections: [] });
    }

    if (path[0] === 'products' && path.length === 1) {
      const db = await ensureSeed();
      const query = {};
      const deity = url.searchParams.get('deity');
      const category = url.searchParams.get('category');
      const subcategory = url.searchParams.get('subcategory');
      const collectionParam = url.searchParams.get('collection');
      const bestSeller = url.searchParams.get('bestSeller');
      const isNew = url.searchParams.get('isNew');
      const priceMin = url.searchParams.get('priceMin');
      const priceMax = url.searchParams.get('priceMax');
      const search = url.searchParams.get('search');
      const limit = parseInt(url.searchParams.get('limit') || '0');

      if (deity) query.deity = deity;
      if (category) query.category = category;
      if (subcategory) query.subcategory = subcategory;
      if (collectionParam) query.collection = collectionParam;
      if (bestSeller === 'true') query.bestSeller = true;
      if (isNew === 'true') query.isNew = true;
      if (priceMin || priceMax) {
        query.price = {};
        if (priceMin) query.price.$gte = parseInt(priceMin);
        if (priceMax) query.price.$lte = parseInt(priceMax);
      }
      if (search) query.name = { $regex: search, $options: 'i' };

      const sort = url.searchParams.get('sort') || 'popular';
      const sortMap = {
        popular: { reviews: -1 },
        newest: { isNew: -1 },
        'price-asc': { price: 1 },
        'price-desc': { price: -1 },
      };

      let cursor = db.collection('products')
        .find(query)
        .sort(sortMap[sort] || sortMap.popular);
      if (limit > 0) cursor = cursor.limit(limit);
      const products = await cursor.toArray();

      return json({ products: products.map(({ _id, ...p }) => p), total: products.length });
    }

    if (path[0] === 'products' && path.length === 2) {
      const db = await ensureSeed();
      const product = await db.collection('products').findOne({ id: path[1] });
      if (!product) return json({ error: 'Product not found' }, 404);
      const { _id, ...rest } = product;

      const related = await db.collection('products')
        .find({
          $or: [
            { deity: product.deity, id: { $ne: product.id } },
            { category: product.category, id: { $ne: product.id } },
          ],
        })
        .limit(4)
        .toArray();

      return json({ product: rest, related: related.map(({ _id, ...p }) => p) });
    }

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('API error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const path = resolvedParams?.path || [];

  try {
    if (path[0] === 'contact') {
      const body = await request.json();
      const db = await getDb();
      const doc = {
        id: crypto.randomUUID(),
        name: body.name,
        email: body.email,
        phone: body.phone || '',
        message: body.message,
        createdAt: new Date().toISOString(),
      };
      await db.collection('contact_messages').insertOne(doc);
      return json({ success: true, id: doc.id });
    }

    if (path[0] === 'newsletter') {
      const body = await request.json();
      const db = await getDb();
      await db.collection('newsletter').insertOne({
        id: crypto.randomUUID(),
        email: body.email,
        createdAt: new Date().toISOString(),
      });
      return json({ success: true });
    }

    if (path[0] === 'orders') {
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

    return json({ error: 'Not found' }, 404);
  } catch (err) {
    console.error('API error:', err);
    return json({ error: err.message || 'Internal error' }, 500);
  }
}
