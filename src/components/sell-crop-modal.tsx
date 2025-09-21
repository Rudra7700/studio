
'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { MandiPriceCardData, Inventory } from '@/lib/types';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SellCropModalProps {
    isOpen: boolean;
    onClose: () => void;
    crop: MandiPriceCardData;
    inventory: Inventory;
}

const saleSchema = z.object({
  quantity: z.number().positive("Quantity must be positive").max(1000, "Quantity is too high"), // Added max for safety
  price: z.number().positive("Price must be positive"),
  buyerName: z.string().min(2, "Buyer name is required"),
  buyerPhone: z.string().regex(/^\d{10}$/, "Invalid phone number (10 digits required)"),
});


export function SellCropModal({ isOpen, onClose, crop, inventory }: SellCropModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();
    
    const form = useForm<z.infer<typeof saleSchema>>({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            quantity: '' as any, // Initialize with empty string to avoid uncontrolled component error
            price: crop.price,
            buyerName: '',
            buyerPhone: '',
        },
    });
    
    const quantityToSell = form.watch('quantity');
    const totalSaleValue = (quantityToSell || 0) * (form.watch('price') || 0);

    const onSubmit = (values: z.infer<typeof saleSchema>) => {
        setIsProcessing(true);
        console.log("Sale data:", values);
        
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            toast({
                title: "Sale Recorded Successfully!",
                description: `${values.quantity} ${inventory.unit} of ${crop.name} sold to ${values.buyerName}.`,
            });
            onClose();
        }, 1500);
    };

    const isPriceDown = crop.change < 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Sell {crop.name}</DialogTitle>
                    <DialogDescription>
                        Record a new sale. Your current inventory is {inventory.quantity} {inventory.unit}.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {isPriceDown && (
                            <Alert variant="destructive" className="bg-yellow-500/10 border-yellow-500/50">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                <AlertTitle className="text-yellow-700">Market Price is Down</AlertTitle>
                                <AlertDescription className="text-yellow-600">
                                    The current market price for {crop.name} is down by {Math.abs(crop.percentChange)}%. Are you sure you want to sell now?
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity to Sell ({inventory.unit})</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="e.g., 50" 
                                                {...field}
                                                value={field.value === null ? '' : field.value}
                                                onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price per Quintal (₹)</FormLabel>
                                        <FormControl>
                                             <Input 
                                                type="number" 
                                                {...field}
                                                value={field.value === null ? '' : field.value}
                                                onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div>
                             <h3 className="text-sm font-medium mb-2">Buyer Details</h3>
                             <div className="space-y-3 p-4 border rounded-md bg-card-foreground/5">
                                 <FormField
                                    control={form.control}
                                    name="buyerName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buyer's Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Vikram Singh" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="buyerPhone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Buyer's Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 9876543210" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                             </div>
                        </div>

                        <div className="p-4 rounded-lg bg-primary/10 flex justify-between items-center">
                            <span className="font-semibold text-primary">Total Sale Value</span>
                            <span className="text-2xl font-bold text-primary">
                                ₹{totalSaleValue.toLocaleString('en-IN')}
                            </span>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>Cancel</Button>
                            <Button type="submit" disabled={isProcessing}>
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isProcessing ? "Recording Sale..." : "Confirm Sale"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
