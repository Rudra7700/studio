import { Shield, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-bold font-headline text-primary", className)}>
      <div className="relative bg-primary text-primary-foreground p-1 rounded-md h-9 w-9 flex items-center justify-center">
        <Shield className="w-8 h-8 opacity-90" />
        <Leaf className="w-5 h-5 absolute" />
      </div>
      <span>EcoFighter's</span>
    </Link>
  );
}
