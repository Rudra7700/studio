import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-bold font-headline text-primary", className)}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
        <Leaf className="w-5 h-5" />
      </div>
      <span>AgriSprayer AI</span>
    </Link>
  );
}
