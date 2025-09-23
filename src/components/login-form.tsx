
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle, registerWithEmail, signInWithEmail } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

const GoogleIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2">
        <title>Google</title>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.05 1.05-2.36 1.67-4.18 1.67-4.97 0-9-4.03-9-9s4.03-9 9-9c2.39 0 4.5 1.02 6.13 2.56l2.34-2.34C18.63 1.19 15.82 0 12.48 0 5.88 0 0 5.88 0 12.48s5.88 12.48 12.48 12.48c6.92 0 11.7-4.72 11.7-12.06 0-.76-.06-1.52-.18-2.28H12.48z"/>
    </svg>
);

export function LoginForm() {
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { toast } = useToast();
  const { setGuest } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsEmailLoading(true);
    const { email, password } = values;
    let result;

    if(isRegistering){
        result = await registerWithEmail(email, password);
        if(result.success) {
            toast({ title: "Registration Successful", description: "Welcome! You are now logged in." });
            router.push('/dashboard');
        }
    } else {
        result = await signInWithEmail(email, password);
         if(result.success) {
            toast({ title: "Login Successful", description: "Welcome back!" });
            router.push('/dashboard');
        }
    }

    if (result && !result.success) {
      toast({
        variant: 'destructive',
        title: isRegistering ? 'Registration Failed' : 'Login Failed',
        description: result.error,
      });
    }
    setIsEmailLoading(false);
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const result = await signInWithGoogle();
    if(result.success) {
        toast({ title: 'Google Sign-In Successful', description: `Welcome, ${result.user.displayName}!` });
        router.push('/dashboard');
    } else {
        toast({ variant: 'destructive', title: 'Google Sign-In Failed', description: result.error });
    }
    setIsGoogleLoading(false);
  }

  const toggleFormMode = () => {
    if (isEmailLoading || isGoogleLoading) return;
    setIsRegistering(!isRegistering);
    form.reset();
  };

  return (
    <div className="grid gap-6">
      <Button variant="outline" onClick={handleGoogleSignIn} disabled={isEmailLoading || isGoogleLoading}>
        {isGoogleLoading ? <Loader2 className="mr-2 animate-spin" /> : <GoogleIcon />}
        Sign in with Google
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="farmer@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    {!isRegistering && (
                         <Button asChild variant="link" size="sm" className="ml-auto">
                            <a href="#">Forgot password?</a>
                        </Button>
                    )}
                </div>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isEmailLoading || isGoogleLoading}>
            {isEmailLoading && <Loader2 className="mr-2 animate-spin" />}
            {isRegistering ? 'Create Account' : 'Login'}
          </Button>
        </form>
      </Form>
      <div className="text-center text-sm">
        {isRegistering ? (
          <>
            Already have an account?{' '}
            <Button type="button" variant="link" onClick={toggleFormMode} className="p-0 h-auto">Sign In</Button>
          </>
        ) : (
          <>
            Don&apos;t have an account?{' '}
             <Button type="button" variant="link" onClick={toggleFormMode} className="p-0 h-auto">Sign Up</Button>
          </>
        )}
      </div>
       <Separator />
        <Button variant="secondary" onClick={setGuest} disabled={isEmailLoading || isGoogleLoading}>
            Continue as Guest
        </Button>
    </div>
  );
}
