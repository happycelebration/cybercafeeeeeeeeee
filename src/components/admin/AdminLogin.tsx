'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, LogIn, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AdminLoginProps {
  onLogin: (email: string, name: string, token: string) => void;
  onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      onLogin(data.admin.email, data.admin.name || 'Admin', data.token);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
        onClick={onBack}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
      >
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-neon/40 via-neon/10 to-transparent" />

        <div className="relative rounded-2xl bg-background/95 p-6 shadow-xl backdrop-blur-2xl sm:p-8">
          <button
            onClick={onBack}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Admin Login</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@jassucafe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-foreground/5"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-foreground/5 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg bg-destructive/10 p-2.5 text-center text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Default: admin@jassucafe.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  );
}
