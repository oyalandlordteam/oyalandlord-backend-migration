'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from '@/lib/router';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Lock, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const { navigate } = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = login(email, password);
    
    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('home');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50/50 dark:bg-black/50">
      <Card className="w-full max-w-md border-border dark:border-white/10 dark:bg-white/5 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-[#008751]/20 flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-in bounce-in duration-700">
            <Building2 className="h-10 w-10 text-primary dark:text-[#00C875]" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="font-bold text-muted-foreground mt-2">
            Sign in to your Oyalandlord account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="font-extrabold text-sm px-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label htmlFor="password" className="font-extrabold text-sm">Password</Label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold focus:ring-primary/20"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-extrabold text-lg shadow-lg shadow-primary/20 mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Sign In Account'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground font-bold">Don&apos;t have an account?</span>{' '}
            <button
              onClick={() => navigate('register')}
              className="text-primary hover:text-primary/80 font-extrabold transition-colors underline underline-offset-4"
            >
              Create Account
            </button>
          </div>

          <div className="mt-8 p-5 bg-gray-100/50 dark:bg-black/40 rounded-xl border border-border dark:border-white/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-1 bg-primary/10 rounded-bl-lg">
              <Shield className="h-3 w-3 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-extrabold uppercase tracking-wider mb-3 text-center">Demo Access Accounts</p>
            <div className="text-[11px] space-y-2 font-bold">
              <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-white/5 border border-transparent dark:border-white/5">
                <span className="text-muted-foreground">Tenant:</span>
                <code className="text-primary">adebayo@email.com</code>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-white/5 border border-transparent dark:border-white/5">
                <span className="text-muted-foreground">Landlord:</span>
                <code className="text-primary">emeka@email.com</code>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white dark:bg-white/5 border border-transparent dark:border-white/5">
                <span className="text-muted-foreground">Solicitor:</span>
                <code className="text-primary">funke@email.com</code>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
