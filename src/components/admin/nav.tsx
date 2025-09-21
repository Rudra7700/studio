
'use client';

import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Settings,
  Users,
  Tractor,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Farmer Management', icon: Users },
  { href: '/admin/drones', label: 'Drone Fleet', icon: Tractor },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
];

export function AdminNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 px-2 text-sm font-medium lg:px-4">
      {adminNavItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-primary hover:bg-sidebar-accent',
            pathname.startsWith(href) && href !== '/admin' ? 'bg-sidebar-accent text-primary font-semibold' : 
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
