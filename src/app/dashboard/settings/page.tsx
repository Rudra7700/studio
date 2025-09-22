
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Bell, MapPin, Tractor, PiggyBank, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

const settingsOptions = [
  {
    icon: <User className="w-8 h-8 text-primary" />,
    title: "Login & Security",
    description: "Edit login, name, and mobile number",
    href: "/dashboard/settings/profile",
  },
  {
    icon: <Bell className="w-8 h-8 text-primary" />,
    title: "Notification Preferences",
    description: "Manage how you receive alerts",
    href: "/dashboard/settings/notifications",
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: "Your Fields",
    description: "Manage your registered farm fields",
    href: "/dashboard/fields",
  },
  {
    icon: <PiggyBank className="w-8 h-8 text-primary" />,
    title: "Financials & Payments",
    description: "Track sales and manage payment methods",
    href: "/dashboard/financials",
  },
  {
    icon: <Tractor className="w-8 h-8 text-primary" />,
    title: "Drone Fleet",
    description: "View and manage your drone fleet",
    href: "/dashboard/drones",
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Admin Dashboard",
    description: "Access system-wide controls",
    href: "/admin",
  },
]


export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold font-headline">Your Account</h1>
        <p className="text-muted-foreground">
          Manage your account, settings, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsOptions.map((option) => (
          <Link href={option.href} key={option.title}>
            <Card className="hover:bg-card-foreground/5 h-full transition-colors">
              <CardHeader className="flex flex-row items-center gap-4">
                {option.icon}
                <div>
                  <CardTitle>{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );
}
