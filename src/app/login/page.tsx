'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppLogo } from '@/components/icons';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';
import type { Provider } from '@supabase/supabase-js';
import { Eye, EyeOff } from 'lucide-react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" {...props}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.8 0-5.18-1.89-6.03-4.43H2.39v2.84C4.13 20.53 7.76 23 12 23z" fill="#34A853" />
        <path d="M5.97 14.25c-.21-.66-.33-1.35-.33-2.08s.12-1.42.33-2.08V7.29H2.39C1.47 9.04 1 10.7 1 12.5s.47 3.46 1.39 5.21l3.58-2.96z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.76 1 4.13 3.47 2.39 7.29l3.58 2.84c.85-2.54 3.23-4.43 6.03-4.43z" fill="#EA4335" />
    </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#1877F2" {...props}>
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const supabase = createClient();


  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('referral_code', ref);
    }
  }, [searchParams]);

  const getURL = () => {
    const isBrowser = typeof window !== 'undefined';
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ??
      (isBrowser ? window.location.origin : undefined) ??
      process?.env?.NEXT_PUBLIC_VERCEL_URL;
    // Ensure protocol
    url = url.includes('http') ? url : `https://${url}`;
    // Ensure trailing slash
    url = url.endsWith('/') ? url : `${url}/`;
    return url;
  };

  const getCallbackURL = () => {
    // If explicit redirect was provided, ensure it targets /auth/callback
    let explicit =
      (process?.env?.NEXT_PUBLIC_SUPABASE_REDIRECT_URL as string | undefined) ??
      (process?.env?.SUPABASE_REDIRECT_URL as string | undefined);

    if (explicit) {
      try {
        const u = new URL(explicit);
        if (!/\/auth\/callback(\/?|\?|$)/.test(u.pathname + (u.search || ''))) {
          u.pathname = (u.pathname?.replace(/\/$/, '') || '') + '/auth/callback';
        }
        return u.toString();
      } catch {
        // If not a valid URL string, fall back to base + /auth/callback
        explicit = undefined;
      }
    }

    return `${getURL()}auth/callback`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "Passwords do not match.",
      });
      return;
    }

    const referralCode = localStorage.getItem('referral_code');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getURL()}auth/callback`,
        data: {
          referred_by: referralCode,
        }
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } else {
      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
      });
      if (referralCode) {
        localStorage.removeItem('referral_code');
      }
      setMode('login'); // Switch back to login view
    }
  };

  const socialLogin = async (provider: Provider) => {
     const referralCode = localStorage.getItem('referral_code');
    const redirectTo = getCallbackURL();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
            referral_code: referralCode || ''
        }
      },
    });
     if (error) {
      toast({
        variant: "destructive",
        title: "Social Login Failed",
        description: error.message,
      });
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const redirectTo = `${getCallbackURL()}?next=/update-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo,
    });

    if (error) {
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
        });
    } else {
        toast({
            title: 'Check your email',
            description: `If an account with ${resetEmail} exists, a password reset link has been sent.`,
        });
    }
  }

  return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
              <AppLogo className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground">
                  {mode === 'login' ? 'Log in to your account' : 'Create an account'}
              </h1>
          </div>

          <Card className="shadow-2xl">
            <CardContent className="p-8 space-y-6">
              {mode === 'login' ? (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => socialLogin('google')}>
                        <GoogleIcon className="mr-2 h-4 w-4" />
                        Google
                        </Button>
                        <Button variant="outline" onClick={() => socialLogin('facebook')}>
                        <FacebookIcon className="mr-2 h-4 w-4" />
                        Facebook
                        </Button>
                    </div>

                    <div className="flex items-center">
                        <div className="flex-grow border-t border-muted" />
                        <span className="mx-4 flex-shrink text-xs uppercase text-muted-foreground">Or continue with</span>
                        <div className="flex-grow border-t border-muted" />
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button type="button" className="text-sm font-medium text-primary hover:underline">Forgot password?</button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <form onSubmit={handlePasswordReset}>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Forgot your password?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Enter your email address and we will send you a link to reset your password.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="my-4">
                                                <Label htmlFor="reset-email">Email</Label>
                                                <Input
                                                    id="reset-email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction type="submit">Send Reset Link</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </form>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="relative">
                                <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required defaultChecked />
                        <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
                            I accept the{' '}
                            <Link href="#" className="underline text-primary hover:text-primary/80">
                            terms and conditions
                            </Link>
                        </Label>
                        </div>
                        <Button type="submit" className="w-full">
                        Log in
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button onClick={() => setMode('register')} className="font-medium text-primary hover:underline">
                            Register
                        </button>
                    </p>
                </>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input id="register-email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                         <div className="relative">
                            <Input id="register-password" type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm Password</Label>
                        <div className="relative">
                            <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                    <Checkbox id="register-terms" required defaultChecked />
                    <Label htmlFor="register-terms" className="text-sm font-normal text-muted-foreground">
                        I accept the{' '}
                        <Link href="#" className="underline text-primary hover:text-primary/80">
                        terms and conditions
                        </Link>
                    </Label>
                    </div>
                    <Button type="submit" className="w-full">
                    Register
                    </Button>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button onClick={() => setMode('login')} className="font-medium text-primary hover:underline">
                            Log in
                        </button>
                    </p>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
