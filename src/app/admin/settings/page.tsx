
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
       <div>
        <h1 className="text-2xl font-bold font-headline">System Settings</h1>
        <p className="text-muted-foreground">Manage global configurations for the EcoFighter's platform.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure basic platform settings and branding.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="appName">Application Name</Label>
                <Input id="appName" defaultValue="EcoFighter's" />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-xs text-muted-foreground">
                        Temporarily disable access to the farmer dashboard for updates.
                    </p>
                </div>
                <Switch />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>API Keys & Integrations</CardTitle>
          <CardDescription>Manage third-party service API keys.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="geminiApiKey">Google AI (Gemini) API Key</Label>
                <Input id="geminiApiKey" type="password" defaultValue="gsk_xxxxxxxxxxxxxxxxxxxxxx" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="mapsApiKey">Google Maps API Key</Label>
                <Input id="mapsApiKey" type="password" defaultValue="AIzaSyxxxxxxxxxxxxxxxxxxxxx" />
            </div>
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Set how system-wide notifications are sent.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                       Send email alerts for critical system events.
                    </p>
                </div>
                <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                       Send push notifications to admin devices for urgent alerts.
                    </p>
                </div>
                <Switch />
            </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
        </Button>
      </div>
    </div>
  );
}
