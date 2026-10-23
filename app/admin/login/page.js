'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

function App() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('vaanya_admin_token')) {
      router.push('/admin');
    }
  }, [router]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('vaanya_admin_token', data.token);
        toast.success('Welcome back, admin!');
        router.push('/admin');
      } else {
        toast.error(data.error || 'Invalid password');
      }
    } catch {
      toast.error('Login failed');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6">
          <img src="/brand/logo-full.png" alt="Vaanya Creations 5" className="h-28 w-auto" />
        </Link>
        <div className="bg-white rounded-2xl p-8 border border-gold/30 shadow-xl">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-saffron/15 flex items-center justify-center mx-auto mb-3">
              <Lock className="h-6 w-6 text-saffron" />
            </div>
            <h1 className="font-serif text-3xl text-maroon">Admin Login</h1>
            <p className="text-maroon/70 text-sm mt-1">Manage products, coupons and orders</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Label htmlFor="pw" className="text-maroon">Password</Label>
              <Input id="pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-cream border-gold/40 mt-1" placeholder="Enter admin password" autoFocus />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full bg-maroon hover:bg-maroon/90 text-cream">
              {submitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-[11px] text-maroon/60 text-center pt-2 flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3 text-saffron" /> Default password: <code className="bg-cream px-1.5 py-0.5 rounded text-maroon">vaanya-admin-2025</code>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
