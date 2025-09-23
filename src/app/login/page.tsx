
import { Logo } from '@/components/logo';
import { LoginForm } from '@/components/login-form';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Logo className="justify-center" />
            <h1 className="text-3xl font-bold mt-4">Welcome Back</h1>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your dashboard
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1595941029094-b3878a1c9769?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxpbmRpYW4lMjBmYXJtJTIwc3VucmlzZXxlbnwwfHx8fDE3NTg5OTM5MDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Indian farm at sunrise"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.4]"
          data-ai-hint="indian farm sunrise"
        />
      </div>
    </div>
  );
}
