
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
import { Save, User, Loader2, Check } from 'lucide-react';
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

export default function ProfileSettingsPage() {
  const { toast } = useToast();
  const [farmer, setFarmer] = useState<Partial<Farmer>>({
    id: 'farmer-1',
    name: mockFarmers[0].name,
    email: mockFarmers[0].email,
    avatarUrl: mockFarmers[0].avatarUrl,
    phone: '9876543210'
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(farmer.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [justSaved, setJustSaved] = useState(false);


  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: farmer.name || '',
      email: farmer.email || '',
      phone: farmer.phone || '',
    },
  });

   useEffect(() => {
    const savedProfileString = localStorage.getItem('farmerProfile');
    let localProfile;
    if (savedProfileString) {
        try {
            localProfile = JSON.parse(savedProfileString);
        } catch (e) {
            console.error("Failed to parse farmerProfile from localStorage", e);
        }
    }
    
    if (localProfile) {
        setFarmer(prev => ({...prev, ...localProfile}));
        form.reset({
            fullName: localProfile.name || prev.name,
            email: localProfile.email || prev.email,
            phone: localProfile.phone || prev.phone,
        });
        if (localProfile.avatarUrl) {
            setAvatarPreview(localProfile.avatarUrl);
        }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


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

    localStorage.setItem('farmerProfile', JSON.stringify(newLocalProfile));
    setFarmer(newLocalProfile);
    
    if (!navigator.onLine) {
        toast({ title: "Saved Locally", description: "Your profile will be synced when you're back online." });
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
        return;
    }
    
    try {
      await updateFarmerProfile(farmer.id, updatedProfileData);
      toast({
        title: 'Settings Saved',
        description: 'Your profile has been updated successfully.',
      });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold font-headline">Login & Security</h1>
          <p className="text-muted-foreground">
            Manage your personal information and login details.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User /> Profile Information</CardTitle>
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

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting || justSaved}>
            {getButtonContent()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
