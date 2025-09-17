
'use client';
import { AlertTriangle, CloudRain, Bug, Wrench, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const mockAlerts = [
  {
    id: 'alert-1',
    type: 'urgent',
    title: 'High Wind Warning',
    description: 'Winds exceeding 30 kph detected near West Wheat Patch. Pausing all drone operations.',
    timestamp: '2 mins ago',
    icon: <AlertTriangle className="h-4 w-4" />,
    action: {
        label: 'View Drones',
        href: '/admin/drones',
    }
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Pest Outbreak Nearby',
    description: 'Aphid outbreak reported in a field 5km away from North Corn Field.',
    timestamp: '34 mins ago',
    icon: <Bug className="h-4 w-4" />,
     action: {
        label: 'Check Field',
        href: '/dashboard/fields?fieldId=field-1',
    }
  },
   {
    id: 'alert-3',
    type: 'info',
    title: 'Drone Maintenance',
    description: 'Drone-002 requires battery calibration. Schedule maintenance soon.',
    timestamp: '1 hour ago',
    icon: <Wrench className="h-4 w-4" />,
     action: {
        label: 'Schedule',
        href: '/admin/drones',
    }
  },
];

const alertStyles = {
    urgent: 'bg-destructive/20 border-destructive text-destructive-foreground',
    warning: 'bg-yellow-500/20 border-yellow-600 text-yellow-800 dark:text-yellow-300',
    info: 'bg-blue-500/20 border-blue-600 text-blue-800 dark:text-blue-300',
};
const iconStyles = {
    urgent: 'text-destructive',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
};

export function RealTimeAlerts() {
    const [visibleAlerts, setVisibleAlerts] = useState(mockAlerts.map(a => a.id));

    const dismissAlert = (id: string) => {
        setVisibleAlerts(prev => prev.filter(alertId => alertId !== id));
    };

    const visibleMockAlerts = mockAlerts.filter(a => visibleAlerts.includes(a.id));
    if (visibleMockAlerts.length === 0) return null;

    return (
        <div className="grid gap-4">
            {visibleMockAlerts.map(alert => (
                <Alert key={alert.id} className={cn("flex items-start justify-between gap-4", alertStyles[alert.type as keyof typeof alertStyles])}>
                    <div className="flex items-start gap-4">
                         <div className={cn(iconStyles[alert.type as keyof typeof iconStyles])}>
                            {alert.icon}
                        </div>
                        <div>
                            <AlertTitle className="font-bold">{alert.title}</AlertTitle>
                            <AlertDescription>
                                {alert.description} <span className="text-xs opacity-70 ml-2">{alert.timestamp}</span>
                            </AlertDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {alert.action && (
                            <Button asChild variant="link" size="sm" className="text-inherit">
                                <Link href={alert.action.href}>{alert.action.label}</Link>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dismissAlert(alert.id)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Dismiss</span>
                        </Button>
                    </div>
                </Alert>
            ))}
        </div>
    );
}
