import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 text-lg font-bold font-headline text-primary", className)}>
      <div className="bg-primary text-primary-foreground p-1 rounded-md h-9 w-9 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" opacity="0.9" />
          <path d="M11 20A7 7 0 0 1 4 13V7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v6a1 1 0 0 0 1 1h2" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <span>EcoFighter's</span>
    </Link>
  );
}
