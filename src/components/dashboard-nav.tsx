
'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Map,
  TestTube2,
  Settings,
  Users,
  BarChart3,
  ShoppingBasket,
  Tractor,
  Trophy,
  PiggyBank,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/fields', label: 'Fields', icon: Map },
  { href: '/dashboard/drones', label: 'Drone View', icon: Tractor },
  { href: '/dashboard/treatments', label: 'Financials', icon: PiggyBank },
  { href: '/dashboard/market', label: 'Mandi Prices', icon: BarChart3 },
  { href: '/dashboard/pesticides', label: 'Buy Pesticides', icon: ShoppingBasket },
  { href: '/dashboard/challenges', label: 'Challenges', icon: Trophy },
];

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav({ isMobile = false, isAdmin = false }: { isMobile?: boolean; isAdmin?: boolean }) {
  const pathname = usePathname();
  const items = isAdmin ? adminNavItems : navItems;

  return (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
            pathname.startsWith(href) && href !== '/dashboard' ? 'bg-sidebar-accent text-primary font-semibold' : 
            pathname === href ? 'bg-sidebar-accent text-primary font-semibold' : 'text-muted-foreground',
             isMobile ? 'text-base' : 'text-sm'
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
