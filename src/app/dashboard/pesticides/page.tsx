
'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPesticides } from '@/lib/mock-data';
import type { Pesticide } from '@/lib/types';
import { ShoppingCart, Minus, Plus, Info, CheckCircle, AlertTriangle, X } from 'lucide-react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';

const typeColor: Record<Pesticide['type'], string> = {
    Fungicide: "bg-blue-100 text-blue-800",
    Insecticide: "bg-red-100 text-red-800",
    Herbicide: "bg-green-100 text-green-800",
    Other: "bg-gray-100 text-gray-800",
};

export default function PesticidesPage() {
    const [selectedPesticide, setSelectedPesticide] = useState<Pesticide | null>(null);
    const [cart, setCart] = useState<Record<string, number>>({});

    const handleAddToCart = (pesticideId: string) => {
        setCart(prev => ({
            ...prev,
            [pesticideId]: (prev[pesticideId] || 0) + 1
        }));
    };

    const handleQuantityChange = (pesticideId: string, amount: number) => {
        setCart(prev => {
            const newQty = (prev[pesticideId] || 0) + amount;
            if (newQty <= 0) {
                const { [pesticideId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [pesticideId]: newQty };
        });
    };

    const totalItemsInCart = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    const cartDetails = Object.entries(cart).map(([id, quantity]) => {
        const pesticide = mockPesticides.find(p => p.id === id);
        return {
            ...pesticide!,
            quantity
        }
    }).filter(Boolean);

    const totalPrice = cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const cartQueryString = encodeURIComponent(JSON.stringify(cart));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline">Buy Pesticides</h1>
                    <p className="text-muted-foreground">Browse and purchase recommended products.</p>
                </div>
                 <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline">
                            <ShoppingCart className="mr-2 h-4 w-4"/>
                            Cart ({totalItemsInCart})
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col">
                        <SheetHeader>
                            <SheetTitle>Your Cart</SheetTitle>
                            <SheetDescription>Review items before checkout.</SheetDescription>
                        </SheetHeader>
                        {cartDetails.length === 0 ? (
                            <div className="flex-grow flex flex-col items-center justify-center text-center">
                                <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4"/>
                                <p className="text-muted-foreground">Your cart is empty.</p>
                            </div>
                        ) : (
                             <ScrollArea className="flex-grow -mx-6 px-6">
                                <div className="space-y-4">
                                    {cartDetails.map(item => (
                                        <div key={item.id} className="flex items-start gap-4">
                                            <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-contain border"/>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString('en-IN')}</p>
                                                <div className="flex items-center justify-start mt-2">
                                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, -1)}><Minus className="h-4 w-4"/></Button>
                                                    <span className="font-bold text-base w-10 text-center">{item.quantity}</span>
                                                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleQuantityChange(item.id, 1)}><Plus className="h-4 w-4"/></Button>
                                                </div>
                                            </div>
                                            <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                        </div>
                                    ))}
                                </div>
                             </ScrollArea>
                        )}
                       
                        {cartDetails.length > 0 && (
                             <SheetFooter className="mt-auto pt-4 border-t">
                                 <div className="w-full space-y-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                    </div>
                                    <Button className="w-full" size="lg" asChild>
                                      <Link href={`/dashboard/checkout?cart=${cartQueryString}`}>Proceed to Checkout</Link>
                                    </Button>
                                 </div>
                            </SheetFooter>
                        )}
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {mockPesticides.map(pesticide => (
                    <Card key={pesticide.id} className="flex flex-col">
                        <CardHeader>
                            <div className="relative aspect-square w-full mb-4">
                                <Image src={pesticide.imageUrl} alt={pesticide.name} fill objectFit="contain" />
                            </div>
                            <CardTitle className="text-lg leading-tight">{pesticide.name}</CardTitle>
                            <Badge variant="outline" className={typeColor[pesticide.type]}>{pesticide.type}</Badge>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-2xl font-bold">₹{pesticide.price.toLocaleString('en-IN')}</p>
                             <p className="text-xs text-muted-foreground">per {pesticide.unit}</p>
                        </CardContent>
                        <CardFooter className="flex-col !items-stretch gap-2">
                             {cart[pesticide.id] > 0 ? (
                                <div className="flex items-center justify-between">
                                    <Button size="icon" variant="outline" onClick={() => handleQuantityChange(pesticide.id, -1)}><Minus className="h-4 w-4"/></Button>
                                    <span className="font-bold text-lg">{cart[pesticide.id]}</span>
                                    <Button size="icon" variant="outline" onClick={() => handleQuantityChange(pesticide.id, 1)}><Plus className="h-4 w-4"/></Button>
                                </div>
                            ) : (
                                <Button onClick={() => handleAddToCart(pesticide.id)}>
                                    <ShoppingCart className="mr-2 h-4 w-4"/> Add to Cart
                                </Button>
                            )}
                            <Button variant="secondary" onClick={() => setSelectedPesticide(pesticide)}>
                                <Info className="mr-2 h-4 w-4"/> Details
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {selectedPesticide && (
                 <Dialog open={!!selectedPesticide} onOpenChange={(isOpen) => !isOpen && setSelectedPesticide(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedPesticide.name}</DialogTitle>
                            <DialogDescription as="div">
                                 <Badge variant="outline" className={typeColor[selectedPesticide.type]}>{selectedPesticide.type}</Badge>
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <p>{selectedPesticide.description}</p>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2"> <CheckCircle className="h-5 w-5 text-green-600"/> Usage Instructions</CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                    <p><strong>Dosage:</strong> {selectedPesticide.usage.dosage}</p>
                                    <p><strong>Method:</strong> {selectedPesticide.usage.method}</p>
                                </CardContent>
                            </Card>

                            <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertTitle className="text-yellow-700">Safety Notes</AlertTitle>
                                <AlertDescription className="text-yellow-600">
                                    <ul className="list-disc pl-5 mt-2">
                                        {selectedPesticide.safetyNotes.map((note, i) => <li key={i}>{note}</li>)}
                                    </ul>
                                </AlertDescription>
                            </Alert>

                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
