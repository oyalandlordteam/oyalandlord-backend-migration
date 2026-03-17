'use client';

import { useState } from 'react';
import { useRouter } from '@/lib/router';
import { useAuthStore } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Building2, User, Mail, Lock, Loader2, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleDescriptions: Record<UserRole, string> = {
  tenant: 'Search and book rental properties',
  landlord: 'List and manage your properties',
  solicitor: 'Provide legal verification services',
  admin: 'Manage the platform and users',
};

function isValidRole(role: string | undefined): role is UserRole {
  return !!role && ['tenant', 'landlord', 'solicitor'].includes(role);
}

export default function RegisterPage() {
  const { navigate, params } = useRouter();
  const { register } = useAuthStore();
  const { toast } = useToast();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Derive role from params - use memo pattern inline
  const paramRole = isValidRole(params.role) ? params.role : 'tenant';
  const [role, setRole] = useState<UserRole>(paramRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = register(name, email, password, role);
    
    if (result.success) {
      toast({
        title: 'Account created!',
        description: `Welcome to Oyalandlord! You are now registered as a ${role}.`,
      });
      navigate('home');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-gray-50/50 dark:bg-black/50">
      <Card className="w-full max-w-lg border-border dark:border-white/10 dark:bg-white/5 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 dark:bg-[#008751]/20 flex items-center justify-center mx-auto mb-6 border border-primary/20 animate-in bounce-in duration-700">
            <Building2 className="h-10 w-10 text-primary dark:text-[#00C875]" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Create Account</CardTitle>
          <CardDescription className="font-bold text-muted-foreground mt-2">
            Join Nigeria&apos;s leading rental marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-extrabold text-sm px-1">Full Name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="font-extrabold text-sm px-1">Email Address</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="password" className="font-extrabold text-sm px-1">Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-extrabold text-sm px-1">Confirm Password</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 dark:bg-black/50 dark:border-white/20 font-bold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label htmlFor="role" className="font-extrabold text-sm px-1">Join Oyalandlord as a</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger className="h-11 dark:bg-black/50 dark:border-white/20 font-extrabold">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#121212] dark:border-white/10">
                  <SelectItem value="tenant" className="font-bold cursor-pointer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Prospective Tenant
                    </div>
                  </SelectItem>
                  <SelectItem value="landlord" className="font-bold cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Property Landlord
                    </div>
                  </SelectItem>
                  <SelectItem value="solicitor" className="font-bold cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-primary" />
                      Legal Solicitor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="p-3 bg-primary/5 dark:bg-[#008751]/10 rounded-lg border border-primary/10 animate-in fade-in duration-300">
                <p className="text-xs text-primary font-extrabold">
                  {roleDescriptions[role]}
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-extrabold text-lg shadow-lg shadow-primary/20 mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Launch Your Account'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground font-bold">Already have an account?</span>{' '}
            <button
              onClick={() => navigate('login')}
              className="text-primary hover:text-primary/80 font-extrabold transition-colors underline underline-offset-4"
            >
              Sign In Instead
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
