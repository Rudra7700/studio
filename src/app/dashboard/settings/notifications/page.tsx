
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Bell, Loader2, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';


export default function NotificationSettingsPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    const handleSave = () => {
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setJustSaved(true);
            toast({
                title: 'Preferences Saved',
                description: 'Your notification settings have been updated.',
            });
            setTimeout(() => setJustSaved(false), 2000);
        }, 1000);
    };

    const getButtonContent = () => {
        if (isSubmitting) {
          return (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          );
        }
        if (justSaved) {
          return (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved!
            </>
          );
        }
        return (
          <>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </>
        );
    };


  return (
    <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-headline">Notification Preferences</h1>
          <p className="text-muted-foreground">
            Choose how you receive alerts and updates from the system.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell/> Channel Preferences</CardTitle>
            <CardDescription>
              Enable or disable different notification channels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive real-time alerts directly on your device.
                </p>
              </div>
              <Switch defaultChecked disabled={isSubmitting}/>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Get a daily summary and critical alerts via email.
                </p>
              </div>
              <Switch disabled={isSubmitting}/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  For critical alerts like severe weather warnings or drone emergencies.
                </p>
              </div>
              <Switch defaultChecked disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="button" size="lg" disabled={isSubmitting || justSaved} onClick={handleSave}>
            {getButtonContent()}
          </Button>
        </div>
    </div>
  );
}
