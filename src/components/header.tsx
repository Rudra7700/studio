
'use client';
import * as React from 'react';
import {
  Search,
  Bell,
  PanelLeft,
  Globe,
  Mic,
  Wifi,
  WifiOff,
  Check,
  BarChart3,
  Bug,
  Scan,
  ShoppingCart,
  TestTube2,
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardNav } from './dashboard-nav';
import { Logo } from './logo';
import { mockFarmers, mockNotifications } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { VoiceInputModal } from './voice-input-modal';
import type { Notification } from '@/lib/types';
import { AiAssistant } from './ai-assistant';

const notificationIcons: Record<Notification['type'], React.ReactNode> = {
  mandiPrice: <BarChart3 className="w-5 h-5 text-green-500" />,
  pesticide: <ShoppingCart className="w-5 h-5 text-yellow-500" />,
  field: <Scan className="w-5 h-5 text-blue-500" />,
  treatment: <TestTube2 className="w-5 h-5 text-purple-500" />,
  general: <Bug className="w-5 h-5 text-red-500" />,
};

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const { toast } = useToast();
  
  const [language, setLanguage] = React.useState('en');
  const [isListening, setIsListening] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [notifications, setNotifications] = React.useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleMicClick = () => {
      // The actual logic is now inside AiAssistant component
      // This is just a placeholder to show the concept
      toast({title: "Voice input is handled by the main assistant window now."});
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  }

  return (
    <>
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs p-0 pt-8">
            <Logo className="mb-4 px-4"/>
            <DashboardNav isMobile={true} />
        </SheetContent>
      </Sheet>
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {segments.slice(1).map((segment, index) => (
            <React.Fragment key={segment}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === segments.length - 2 ? (
                  <BreadcrumbPage className="capitalize">{segment}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                     <Link href={`/${segments.slice(0, index + 2).join('/')}`} className="capitalize">
                      {segment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="relative ml-auto flex items-center gap-2 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-card pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <div className="flex items-center gap-2">

        <Button variant="outline" size="icon" className="shrink-0 relative" onClick={() => toast({ title: isOnline ? 'System is online' : 'System is offline', description: isOnline ? 'All systems operational.' : 'Using cached data. Some features may be unavailable.'})}>
            {isOnline ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5 text-destructive"/>}
            <span className="sr-only">Connectivity Status</span>
        </Button>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                    <Globe className="h-5 w-5" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="hi">हिंदी (Hindi)</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                    )}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
                <DropdownMenuLabel className="flex items-center justify-between">
                    Notifications
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        <Check className="mr-2 h-4 w-4"/>
                        Mark all as read
                    </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 && <p className="text-sm text-muted-foreground p-4 text-center">No new notifications.</p>}
                    {notifications.map(n => (
                         <DropdownMenuItem key={n.id} className={cn("gap-3 items-start", !n.read && "bg-primary/5")} onSelect={(e) => {e.preventDefault(); markAsRead(n.id)}}>
                            <div className="mt-1">{notificationIcons[n.type]}</div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{n.title}</p>
                                <p className="text-xs text-muted-foreground">{n.description}</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">{n.timestamp}</p>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Link href="/dashboard/settings">
              <Image
                src={mockFarmers[0].avatarUrl}
                width={36}
                height={36}
                alt="Avatar"
                className="overflow-hidden"
                data-ai-hint="person smiling"
              />
            </Link>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <Link href="/dashboard/settings"><DropdownMenuItem>Settings</DropdownMenuItem></Link>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </header>
    </>
  );
}
