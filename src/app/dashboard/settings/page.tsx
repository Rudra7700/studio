
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, User, Bell, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockFarmers } from '@/lib/mock-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChangeEvent, useRef, useState, useEffect } from 'react';
import { updateFarmerProfile } from '@/lib/firebase';
import type { Farmer } from '@/lib/types';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function DashboardSettingsPage() {
  const { toast } = useToast();
  const [farmer, setFarmer] = useState<Partial<Farmer>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

   useEffect(() => {
    // Load profile from localStorage first for offline support and speed
    const savedProfileString = localStorage.getItem('farmerProfile');
    const initialProfile = savedProfileString ? JSON.parse(savedProfileString) : {
      id: 'farmer-1',
      name: mockFarmers[0].name,
      email: mockFarmers[0].email,
      avatarUrl: mockFarmers[0].avatarUrl,
      phone: '9876543210'
    };
    setFarmer(initialProfile);
    setAvatarPreview(initialProfile.avatarUrl);
    form.reset({
        fullName: initialProfile.name,
        email: initialProfile.email,
        phone: initialProfile.phone,
    });
  }, [form]);


  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setAvatarPreview(result);
          };
          reader.readAsDataURL(file);
      }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!farmer || !farmer.id) {
        toast({ variant: 'destructive', title: "Save Failed", description: "Farmer profile not loaded." });
        return;
    }
    
    const updatedProfileData: Partial<Farmer> = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        avatarUrl: avatarPreview || farmer.avatarUrl,
    };
     const newLocalProfile = {...farmer, ...updatedProfileData};

    // Optimistically update local state and localStorage
    localStorage.setItem('farmerProfile', JSON.stringify(newLocalProfile));
    setFarmer(newLocalProfile);
    
    if (!navigator.onLine) {
        toast({ title: "Saved Locally", description: "Your profile will be synced when you're back online." });
        return;
    }
    
    try {
      await updateFarmerProfile(farmer.id, updatedProfileData);
      toast({
        title: 'Settings Saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
        console.error("Failed to save settings to Firebase", error);
        toast({ variant: 'destructive', title: "Sync Failed", description: "Could not save settings to the cloud. Changes are saved locally." });
    }
  };
  
  const getFallbackInitial = () => {
    if (farmer?.name) {
      return farmer.name.charAt(0).toUpperCase();
    }
    return 'F';
  }
  
  const { formState: { isSubmitting } } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-headline">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and notification preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information. Changes are saved permanently.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
              <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview || undefined} alt={farmer?.name} />
                      <AvatarFallback>{getFallbackInitial()}</AvatarFallback>
                  </Avatar>
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                      Change Picture
                      </Button>
                      <Input 
                          id="avatar-upload" 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/png, image/jpeg, image/webp"
                      />
                  </div>
                  <FormMessage />
              </FormItem>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                          <Input placeholder="Your full name" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                          <Input placeholder="your.email@example.com" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                          <Input placeholder="10-digit mobile number" {...field} disabled={isSubmitting}/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell/> Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you receive alerts from the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive alerts directly on your device.
                </p>
              </div>
              <Switch defaultChecked disabled={isSubmitting}/>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Get a summary and critical alerts via email.
                </p>
              </div>
              <Switch disabled={isSubmitting}/>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  For critical alerts like severe weather warnings.
                </p>
              </div>
              <Switch defaultChecked disabled={isSubmitting}/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Save className="mr-2 h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
