'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Package, Tag, ShoppingBag, Plus, Trash2, Upload, X, Star, Sparkles, Image as ImageIcon, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEITIES, CATEGORIES } from '@/lib/products-data';
import { toast } from 'sonner';

function AdminPanel() {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showAddCoupon, setShowAddCoupon] = useState(false);

  useEffect(() => {
    const t = typeof window !== 'undefined' && localStorage.getItem('vaanya_admin_token');
    if (!t) { router.push('/admin/login'); return; }
    setToken(t);
  }, [router]);

  const authHeaders = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [pr, cp, or, ms] = await Promise.all([
        fetch('/api/admin/products', { headers: authHeaders }).then(r => r.json()),
        fetch('/api/admin/coupons', { headers: authHeaders }).then(r => r.json()),
        fetch('/api/admin/orders', { headers: authHeaders }).then(r => r.json()),
        fetch('/api/admin/messages', { headers: authHeaders }).then(r => r.json()),
      ]);
      setProducts(pr.products || []);
      setCoupons(cp.coupons || []);
      setOrders(or.orders || []);
      setMessages(ms.messages || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  useEffect(() => { if (token) loadData(); /* eslint-disable-next-line */ }, [token]);

  const logout = () => { localStorage.removeItem('vaanya_admin_token'); router.push('/admin/login'); };

  const toggleField = async (id, field, value) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PATCH', headers: authHeaders, body: JSON.stringify({ [field]: value }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
      toast.success(`Updated ${field}`);
    } else toast.error('Update failed');
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: authHeaders });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } else toast.error('Delete failed');
  };

  const toggleCoupon = async (code, active) => {
    const res = await fetch(`/api/admin/coupons/${code}`, {
      method: 'PATCH', headers: authHeaders, body: JSON.stringify({ active }),
    });
    if (res.ok) {
      setCoupons((prev) => prev.map((c) => c.code === code ? { ...c, active } : c));
      toast.success('Coupon updated');
    }
  };

  const deleteCoupon = async (code) => {
    if (!confirm(`Delete coupon ${code}?`)) return;
    const res = await fetch(`/api/admin/coupons/${code}`, { method: 'DELETE', headers: authHeaders });
    if (res.ok) {
      setCoupons((prev) => prev.filter((c) => c.code !== code));
      toast.success('Coupon deleted');
    }
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-cream">
      {/* Admin header */}
      <header className="bg-maroon text-cream sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center">
              <span className="font-serif text-white text-lg font-bold">V</span>
            </div>
            <div>
              <div className="font-serif text-xl font-bold text-gold">Vaanya Admin</div>
              <div className="text-[9px] uppercase tracking-widest text-cream/70 -mt-1">Dashboard</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-cream/80 hover:text-gold text-sm hidden sm:inline">View store →</Link>
            <Button size="sm" variant="outline" onClick={logout} className="border-gold/40 text-cream hover:bg-gold hover:text-maroon">
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-serif text-3xl md:text-4xl text-maroon">Dashboard</h1>
          <p className="text-maroon/70 mt-1">Manage your store</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Products', value: products.length, icon: Package, color: 'bg-saffron/15 text-saffron' },
            { label: 'Active Coupons', value: coupons.filter(c => c.active).length, icon: Tag, color: 'bg-gold/15 text-gold' },
            { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'bg-maroon/10 text-maroon' },
            { label: 'Messages', value: messages.length, icon: Sparkles, color: 'bg-green-500/15 text-green-700' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gold/30 p-4">
              <div className={`w-10 h-10 rounded-full ${s.color} flex items-center justify-center mb-2`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold text-maroon font-serif">{s.value}</div>
              <div className="text-xs text-maroon/60">{s.label}</div>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="bg-white border border-gold/30">
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="coupons">Coupons ({coupons.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddProduct(true)} className="bg-maroon hover:bg-maroon/90 text-cream">
                <Plus className="h-4 w-4 mr-1" /> Add Product
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-gold/30 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-cream border-b border-gold/30">
                    <tr className="text-left text-maroon">
                      <th className="p-3">Image</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Deity</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Bestseller</th>
                      <th className="p-3">New In</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="p-8 text-center text-maroon/60">Loading...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan={7} className="p-8 text-center text-maroon/60">No products yet</td></tr>
                    ) : products.map((p) => (
                      <tr key={p.id} className="border-b border-gold/10 hover:bg-cream/40">
                        <td className="p-3"><img src={p.images?.[0]} alt={p.name} className="w-12 h-12 object-cover rounded" /></td>
                        <td className="p-3 text-maroon">
                          <div className="font-medium line-clamp-1 max-w-[220px]">{p.name}</div>
                          <div className="text-[10px] text-maroon/50">{p.id} • {p.subcategory || '—'}</div>
                        </td>
                        <td className="p-3 text-maroon/70">{p.deity || '—'}</td>
                        <td className="p-3 text-maroon font-medium">₹{p.price?.toLocaleString('en-IN')}<div className="text-[10px] text-maroon/50 line-through">₹{p.mrp?.toLocaleString('en-IN')}</div></td>
                        <td className="p-3"><Switch checked={!!p.bestSeller} onCheckedChange={(v) => toggleField(p.id, 'bestSeller', v)} /></td>
                        <td className="p-3"><Switch checked={!!p.isNew} onCheckedChange={(v) => toggleField(p.id, 'isNew', v)} /></td>
                        <td className="p-3 text-right">
                          <div className="inline-flex gap-1">
                            <button onClick={() => setEditProduct(p)} className="text-maroon/60 hover:text-saffron" title="Edit"><Pencil className="h-4 w-4" /></button>
                            <button onClick={() => deleteProduct(p.id)} className="text-maroon/40 hover:text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* COUPONS TAB */}
          <TabsContent value="coupons">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowAddCoupon(true)} className="bg-maroon hover:bg-maroon/90 text-cream">
                <Plus className="h-4 w-4 mr-1" /> Add Coupon
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-gold/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream border-b border-gold/30">
                  <tr className="text-left text-maroon">
                    <th className="p-3">Code</th>
                    <th className="p-3">Discount</th>
                    <th className="p-3">Min Cart</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Active</th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.length === 0 ? (
                    <tr><td colSpan={6} className="p-8 text-center text-maroon/60">No coupons yet</td></tr>
                  ) : coupons.map((c) => (
                    <tr key={c.code} className="border-b border-gold/10">
                      <td className="p-3"><code className="bg-cream px-2 py-1 rounded text-maroon font-semibold">{c.code}</code></td>
                      <td className="p-3 text-maroon">{c.discountPct > 0 ? `${c.discountPct}% off` : `₹${c.discountAmt} off`}</td>
                      <td className="p-3 text-maroon/70">₹{c.minCartValue || 0}</td>
                      <td className="p-3 text-maroon/70 text-xs max-w-[240px]">{c.description}</td>
                      <td className="p-3"><Switch checked={!!c.active} onCheckedChange={(v) => toggleCoupon(c.code, v)} /></td>
                      <td className="p-3 text-right"><button onClick={() => deleteCoupon(c.code)} className="text-maroon/40 hover:text-destructive"><Trash2 className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <div className="bg-white rounded-xl border border-gold/30 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-cream border-b border-gold/30">
                  <tr className="text-left text-maroon"><th className="p-3">Order ID</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th></tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (<tr><td colSpan={5} className="p-8 text-center text-maroon/60">No orders yet</td></tr>) : orders.map((o) => (
                    <tr key={o.id} className="border-b border-gold/10">
                      <td className="p-3 text-maroon font-mono text-xs">{o.id}</td>
                      <td className="p-3 text-maroon/70">{o.items?.length || 0} items</td>
                      <td className="p-3 text-maroon font-medium">₹{o.total?.toLocaleString('en-IN')}</td>
                      <td className="p-3"><Badge className="bg-saffron/15 text-saffron">{o.status}</Badge></td>
                      <td className="p-3 text-maroon/60 text-xs">{o.createdAt ? new Date(o.createdAt).toLocaleString() : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <div className="space-y-3">
              {messages.length === 0 ? (<div className="bg-white rounded-xl border border-gold/30 p-8 text-center text-maroon/60">No messages yet</div>) : messages.map((m) => (
                <div key={m.id} className="bg-white rounded-xl border border-gold/30 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div><span className="font-semibold text-maroon">{m.name}</span><span className="text-maroon/60 text-sm ml-2">{m.email}{m.phone && ' • ' + m.phone}</span></div>
                    <span className="text-xs text-maroon/50">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <p className="text-maroon/85 text-sm">{m.message}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddProductDialog open={showAddProduct} onOpenChange={setShowAddProduct} token={token} onCreated={(p) => { setProducts((prev) => [p, ...prev]); }} />
      <EditProductDialog product={editProduct} onOpenChange={(open) => { if (!open) setEditProduct(null); }} token={token} onUpdated={(updated) => { setProducts((prev) => prev.map((p) => p.id === updated.id ? { ...p, ...updated } : p)); }} />
      <AddCouponDialog open={showAddCoupon} onOpenChange={setShowAddCoupon} token={token} onCreated={(c) => { setCoupons((prev) => [c, ...prev]); }} />
    </div>
  );
}

function AddProductDialog({ open, onOpenChange, token, onCreated }) {
  const [form, setForm] = useState({ name: '', price: '', mrp: '', deity: 'laddu-gopal', category: 'dresses', subcategory: 'poshak', collection: 'designer', fabric: '', color: '', occasion: 'All', sizes: '', description: '', materials: '', care: '', bestSeller: false, isNew: true });
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.success) {
        setImages((prev) => [...prev, data.url]);
        toast.success('Image uploaded');
      } else toast.error(data.error || 'Upload failed');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (images.length === 0) { toast.error('Add at least one image'); return; }
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product created!');
        onCreated(data.product);
        onOpenChange(false);
        setForm({ name: '', price: '', mrp: '', deity: 'laddu-gopal', category: 'dresses', subcategory: 'poshak', collection: 'designer', fabric: '', color: '', occasion: 'All', sizes: '', description: '', materials: '', care: '', bestSeller: false, isNew: true });
        setImages([]);
      } else toast.error(data.error || 'Create failed');
    } catch { toast.error('Create failed'); }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-maroon">Add Product</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          {/* Images */}
          <div>
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gold/30">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5"><X className="h-3 w-3 text-destructive" /></button>
                </div>
              ))}
              {images.length < 4 && (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-square rounded-lg border-2 border-dashed border-gold/40 flex flex-col items-center justify-center text-maroon/60 hover:border-maroon hover:text-maroon disabled:opacity-50">
                  {uploading ? <span className="text-xs">Uploading...</span> : (<><Upload className="h-5 w-5" /><span className="text-[10px] mt-1">Upload</span></>)}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }} />
            </div>
            <p className="text-[11px] text-maroon/60 mt-1">Up to 4 images. JPG/PNG/WEBP, max 6MB each.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Product Name*</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Vihari Laal Laddu Gopal Poshak" /></div>
            <div><Label>Price (₹)*</Label><Input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><Label>MRP (₹)</Label><Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} /></div>

            <div><Label>Deity</Label>
              <Select value={form.deity} onValueChange={(v) => setForm({ ...form, deity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEITIES.map(d => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Sub-category</Label><Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="poshak, necklace, mukut..." /></div>
            <div><Label>Collection</Label><Input value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} placeholder="designer, luxe, summer..." /></div>
            <div><Label>Fabric</Label><Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} placeholder="Silk, Cotton..." /></div>
            <div><Label>Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} placeholder="Red" /></div>
            <div><Label>Occasion</Label><Input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} placeholder="Janmashtami" /></div>
            <div className="col-span-2"><Label>Sizes (comma-separated)</Label><Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} placeholder="0, 1, 2, 3, 4" /></div>
            <div className="col-span-2"><Label>Description</Label><Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Materials</Label><Input value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} /></div>
            <div><Label>Care</Label><Input value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.bestSeller} onCheckedChange={(v) => setForm({ ...form, bestSeller: v })} /><Label>Bestseller</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.isNew} onCheckedChange={(v) => setForm({ ...form, isNew: v })} /><Label>New In</Label></div>
          </div>

          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={submitting} className="bg-maroon text-cream">{submitting ? 'Creating...' : 'Create Product'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({ product, onOpenChange, token, onUpdated }) {
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);
  const open = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        price: product.price || '',
        mrp: product.mrp || '',
        deity: product.deity || 'laddu-gopal',
        category: product.category || 'dresses',
        subcategory: product.subcategory || 'poshak',
        collection: product.collection || '',
        fabric: product.fabric || '',
        color: product.color || '',
        occasion: product.occasion || 'All',
        sizes: (product.sizes || []).join(', '),
        description: product.description || '',
        materials: product.materials || '',
        care: product.care || '',
        bestSeller: !!product.bestSeller,
        isNew: !!product.isNew,
        inStock: product.inStock !== false,
      });
      setImages(product.images || []);
    }
  }, [product]);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      const data = await res.json();
      if (data.success) { setImages((prev) => [...prev, data.url]); toast.success('Image uploaded'); }
      else toast.error(data.error || 'Upload failed');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        price: parseInt(form.price),
        mrp: parseInt(form.mrp),
        sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        images,
      };
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Product updated!');
        onUpdated({ id: product.id, ...payload });
        onOpenChange(false);
      } else toast.error(data.error || 'Update failed');
    } catch { toast.error('Update failed'); }
    setSubmitting(false);
  };

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif text-2xl text-maroon">Edit Product</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gold/30">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5"><X className="h-3 w-3 text-destructive" /></button>
                </div>
              ))}
              {images.length < 6 && (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="aspect-square rounded-lg border-2 border-dashed border-gold/40 flex flex-col items-center justify-center text-maroon/60 hover:border-maroon hover:text-maroon disabled:opacity-50">
                  {uploading ? <span className="text-xs">Uploading...</span> : (<><Upload className="h-5 w-5" /><span className="text-[10px] mt-1">Upload</span></>)}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = ''; }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Product Name*</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Price (₹)*</Label><Input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></div>
            <div><Label>MRP (₹)</Label><Input type="number" value={form.mrp} onChange={(e) => setForm({ ...form, mrp: e.target.value })} /></div>
            <div><Label>Deity</Label>
              <Select value={form.deity} onValueChange={(v) => setForm({ ...form, deity: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEITIES.map(d => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div><Label>Sub-category</Label><Input value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} /></div>
            <div><Label>Collection</Label><Input value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} /></div>
            <div><Label>Fabric</Label><Input value={form.fabric} onChange={(e) => setForm({ ...form, fabric: e.target.value })} /></div>
            <div><Label>Color</Label><Input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} /></div>
            <div><Label>Occasion</Label><Input value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })} /></div>
            <div className="col-span-2"><Label>Sizes (comma-separated)</Label><Input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></div>
            <div className="col-span-2"><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Materials</Label><Input value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} /></div>
            <div><Label>Care</Label><Input value={form.care} onChange={(e) => setForm({ ...form, care: e.target.value })} /></div>
            <div className="flex items-center gap-2"><Switch checked={form.bestSeller} onCheckedChange={(v) => setForm({ ...form, bestSeller: v })} /><Label>Bestseller</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.isNew} onCheckedChange={(v) => setForm({ ...form, isNew: v })} /><Label>New In</Label></div>
            <div className="flex items-center gap-2"><Switch checked={form.inStock} onCheckedChange={(v) => setForm({ ...form, inStock: v })} /><Label>In Stock</Label></div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-maroon text-cream">{submitting ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddCouponDialog({ open, onOpenChange, token, onCreated }) {
  const [form, setForm] = useState({ code: '', discountPct: 10, discountAmt: 0, minCartValue: 0, description: '', active: true });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Coupon created!');
        onCreated(data.coupon);
        onOpenChange(false);
        setForm({ code: '', discountPct: 10, discountAmt: 0, minCartValue: 0, description: '', active: true });
      } else toast.error(data.error || 'Create failed');
    } catch { toast.error('Create failed'); }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-serif text-2xl text-maroon">Add Coupon</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-3">
          <div><Label>Coupon Code*</Label><Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="BLESSED10" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Discount %</Label><Input type="number" value={form.discountPct} onChange={(e) => setForm({ ...form, discountPct: e.target.value })} /></div>
            <div><Label>Discount ₹ (flat)</Label><Input type="number" value={form.discountAmt} onChange={(e) => setForm({ ...form, discountAmt: e.target.value })} /></div>
            <div><Label>Min Cart ₹</Label><Input type="number" value={form.minCartValue} onChange={(e) => setForm({ ...form, minCartValue: e.target.value })} /></div>
            <div className="flex items-center gap-2 pt-6"><Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} /><Label>Active</Label></div>
          </div>
          <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="10% off on Janmashtami sale" /></div>
          <DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={submitting} className="bg-maroon text-cream">{submitting ? 'Creating...' : 'Create Coupon'}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminPanel;
