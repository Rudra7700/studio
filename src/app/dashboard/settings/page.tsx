
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
import { getFarmerProfile, updateFarmerProfile } from '@/lib/firebase';
import type { Farmer } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function DashboardSettingsPage() {
  const { toast } = useToast();
  const [farmer, setFarmer] = useState<Partial<Farmer> | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      try {
        if (navigator.onLine) {
            // In a real app, the UID would come from an auth context
            const farmerId = 'farmer-1';
            const profile = await getFarmerProfile(farmerId);

            if (profile) {
              setFarmer(profile);
              form.reset({
                fullName: profile.name,
                email: profile.email,
                phone: profile.phone || '',
              });
              if (profile.avatarUrl) {
                setAvatarPreview(profile.avatarUrl);
              }
            } else {
              throw new Error('Profile not found, falling back to mock data.');
            }
        } else {
            console.warn("Client is offline. Loading mock data.");
            throw new Error("Client is offline.");
        }
      } catch (error) {
        console.warn("Could not fetch profile, falling back to mock data. Error:", error);
        // Fallback to mock data if no profile exists or if offline
        const mockProfile = {
            id: 'farmer-1',
            name: mockFarmers[0].name,
            email: mockFarmers[0].email,
            avatarUrl: mockFarmers[0].avatarUrl,
            phone: '9876543210'
        };
        setFarmer(mockProfile);
        form.reset({
            fullName: mockProfile.name,
            email: mockProfile.email,
            phone: mockProfile.phone
        });
        if (mockProfile.avatarUrl) {
          setAvatarPreview(mockProfile.avatarUrl);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
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
    try {
      const updatedProfileData: Partial<Farmer> = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        avatarUrl: avatarPreview || farmer.avatarUrl,
      };
      
      await updateFarmerProfile(farmer.id, updatedProfileData);
      
      setFarmer(prev => ({...prev, ...updatedProfileData}));
      
      toast({
        title: 'Settings Saved',
        description: 'Your profile has been updated successfully in Firestore.',
      });
    } catch (error) {
        console.error("Failed to save settings to Firestore", error);
        toast({ variant: 'destructive', title: "Save Failed", description: "Could not save settings. You may be offline." });
    }
  };
  
  const getFallbackInitial = () => {
    if (farmer?.name) {
      return farmer.name.charAt(0).toUpperCase();
    }
    return 'F';
  }


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
            {isLoading ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-10 w-28" />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                        <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                </div>
            ) : (
            <>
              <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarPreview || undefined} alt={farmer?.name} />
                      <AvatarFallback>{getFallbackInitial()}</AvatarFallback>
                  </Avatar>
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
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
                          <Input placeholder="Your full name" {...field} />
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
                          <Input placeholder="your.email@example.com" {...field} />
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
                          <Input placeholder="10-digit mobile number" {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              </div>
            </>
            )}
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
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Get a summary and critical alerts via email.
                </p>
              </div>
              <Switch />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>SMS Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  For critical alerts like severe weather warnings.
                </p>
              </div>
              <Switch defaultChecked/>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={form.formState.isSubmitting || isLoading}>
            {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <Save className="mr-2 h-4 w-4" />
            )}
            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

    