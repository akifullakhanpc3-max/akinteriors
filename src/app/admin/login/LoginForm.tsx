'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Diamond, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormProps {
  callbackUrl?: string;
  error?: string;
}

export default function LoginForm({ callbackUrl, error: urlError }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const errorMessage = urlError === 'CredentialsSignin'
    ? 'Invalid email or password'
    : urlError
    ? 'An authentication error occurred'
    : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      callbackUrl: callbackUrl || '/admin/dashboard',
    });
  }

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mx-auto mb-4">
              <Diamond className="w-8 h-8 text-[#C8A97E]" />
            </div>
            <h1 className="text-2xl font-bold text-[#111827]">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@akinteriors.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <Button type="submit" variant="gold" className="w-full rounded-full" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="mr-2 w-4 h-4" /> Sign In</>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
