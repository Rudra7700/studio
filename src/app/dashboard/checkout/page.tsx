

'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { mockPesticides, mockTransactions } from '@/lib/mock-data';
import Image from 'next/image';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import type { Transaction } from '@/lib/types';

const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().regex(/^\d{6}$/, "Invalid ZIP code"),
  phone: z.string().regex(/^\d{10}$/, "Invalid phone number"),
});

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/, "Invalid card number"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  cardHolder: z.string().min(2, "Cardholder name is required"),
});

const checkoutSchema = addressSchema.merge(paymentSchema);

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const cartString = searchParams.get('cart') || '{}';
  let cart: Record<string, number> = {};
  try {
    cart = JSON.parse(decodeURIComponent(cartString));
  } catch (e) {
    console.error("Failed to parse cart data", e);
  }

  const cartDetails = Object.entries(cart).map(([id, quantity]) => {
    const pesticide = mockPesticides.find(p => p.id === id);
    return { ...pesticide!, quantity };
  }).filter(item => item.id);

  const subtotal = cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + tax + shipping;

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: '',
    },
  });

  function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setIsProcessing(true);
    console.log(values);
    // Simulate API call
    setTimeout(() => {
        setIsProcessing(false);
        toast({
            title: "Order Placed Successfully!",
            description: "Your pesticide order has been confirmed. You will receive an update shortly.",
        });

        // Record transaction
        const newTransaction: Transaction = {
          id: `tx-${Date.now()}`,
          date: new Date().toISOString(),
          description: `Purchase of ${cartDetails.length} pesticide item(s)`,
          category: 'Pesticides',
          amount: total,
          type: 'expense',
        };
        
        const storedTransactionsString = localStorage.getItem('transactions');
        const transactions = storedTransactionsString ? JSON.parse(storedTransactionsString) : mockTransactions;
        transactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));


        router.push('/dashboard/financials');
    }, 2000);
  }

  if (cartDetails.length === 0) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">Your cart is empty.</h1>
        <Button onClick={() => router.push('/dashboard/pesticides')} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold font-headline mb-6">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="fullName" render={({ field }) => (
                  <FormItem className="md:col-span-2"><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Rajesh Kumar" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2"><FormLabel>Address</FormLabel><FormControl><Input placeholder="123, Farmer's Lane" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="Indore" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input placeholder="Madhya Pradesh" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="zip" render={({ field }) => (
                    <FormItem><FormLabel>ZIP Code</FormLabel><FormControl><Input placeholder="452001" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                 <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="9876543210" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Details</CardTitle>
                <CardDescription>All transactions are secure and encrypted.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <FormField control={form.control} name="cardNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <Input placeholder="**** **** **** 1234" {...field} />
                                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                  )} />
                <div className="grid grid-cols-3 gap-4">
                     <FormField control={form.control} name="expiryDate" render={({ field }) => (
                        <FormItem><FormLabel>Expiry (MM/YY)</FormLabel><FormControl><Input placeholder="12/28" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="cvv" render={({ field }) => (
                        <FormItem><FormLabel>CVV</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="cardHolder" render={({ field }) => (
                    <FormItem><FormLabel>Cardholder Name</FormLabel><FormControl><Input placeholder="Rajesh Kumar" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {cartDetails.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-md object-contain border" />
                        <div>
                            <p className="font-medium truncate max-w-36">{item.name}</p>
                            <p className="text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Subtotal</p>
                        <p>₹{subtotal.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex justify-between">
                        <p className="text-muted-foreground">Taxes (5%)</p>
                        <p>₹{tax.toLocaleString('en-IN')}</p>
                    </div>
                     <div className="flex justify-between">
                        <p className="text-muted-foreground">Shipping</p>
                        <p>₹{shipping.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <p>Total</p>
                    <p>₹{total.toLocaleString('en-IN')}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                    {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isProcessing ? 'Processing...' : `Place Order (₹${total.toLocaleString('en-IN')})`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div>Loading checkout...</div>}>
            <CheckoutPageContent />
        </Suspense>
    )
}
