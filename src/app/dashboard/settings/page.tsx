
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
import { Save, User, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockFarmers } from '@/lib/mock-data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { ChangeEvent, useRef, useState, useEffect } from 'react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required.'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits.'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultFarmerData = {
  name: mockFarmers[0].name,
  email: mockFarmers[0].email,
  avatarUrl: mockFarmers[0].avatarUrl,
  phone: '9876543210',
};

export default function DashboardSettingsPage() {
  const { toast } = useToast();
  const [farmer, setFarmer] = useState(defaultFarmerData);
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
    try {
      const savedFarmer = localStorage.getItem('farmerProfile');
      const savedAvatar = localStorage.getItem('avatarPreview');
      if (savedFarmer) {
        const parsedFarmer = JSON.parse(savedFarmer);
        setFarmer(parsedFarmer);
        form.reset(parsedFarmer);
      } else {
        setFarmer(defaultFarmerData);
        form.reset({
          fullName: defaultFarmerData.name,
          email: defaultFarmerData.email,
          phone: defaultFarmerData.phone
        });
      }
      if (savedAvatar) {
        setAvatarPreview(savedAvatar);
      }
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      form.reset({
        fullName: defaultFarmerData.name,
        email: defaultFarmerData.email,
        phone: defaultFarmerData.phone
      });
    }
  }, [form]);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              setAvatarPreview(result);
              try {
                localStorage.setItem('avatarPreview', result);
              } catch (error) {
                console.error("Failed to save avatar to localStorage", error);
                toast({ variant: 'destructive', title: "Could not save image", description: "Browser storage might be full." });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const onSubmit = (data: ProfileFormValues) => {
    try {
      const updatedProfile = {
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        avatarUrl: farmer.avatarUrl // Keep original avatar URL, preview is handled separately
      };
      localStorage.setItem('farmerProfile', JSON.stringify(updatedProfile));
      
      // Update the name in the farmer state to reflect in fallback
      setFarmer(prev => ({...prev, name: data.fullName}));
      
      toast({
        title: 'Settings Saved',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
        toast({ variant: 'destructive', title: "Save Failed", description: "Could not save settings. Please try again." });
    }
  };

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
              Update your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormItem>
                <FormLabel>Profile Picture</FormLabel>
                <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={avatarPreview || farmer.avatarUrl} alt={farmer.name} />
                    <AvatarFallback>{farmer.name ? farmer.name.charAt(0) : 'U'}</AvatarFallback>
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
          <Button type="submit" size="lg">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
