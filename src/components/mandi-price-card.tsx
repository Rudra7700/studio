'use client';

import type { MandiPriceCardData } from "@/lib/types";
import { Card, CardContent } from "./ui/card";
import { MapPin, ArrowUp, ArrowDown, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface MandiPriceCardProps {
    data: MandiPriceCardData;
}

export function MandiPriceCard({ data }: MandiPriceCardProps) {
    const isPositive = data.change >= 0;

    return (
        <Card className="bg-primary/5 hover:bg-primary/10 transition-colors group">
            <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-foreground">{data.name}</h3>
                    <div className="text-xs inline-flex items-center gap-1.5 bg-card px-2 py-1 rounded-full text-muted-foreground">
                        <MapPin className="w-3 h-3"/>
                        {data.mandi}
                    </div>
                </div>

                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-3xl font-bold text-primary">₹{data.price.toLocaleString('en-IN')}</p>
                        <p className="text-sm text-muted-foreground">per quintal</p>
                    </div>
                    <div className={cn("text-right", isPositive ? 'text-green-600' : 'text-red-600')}>
                        <div className="flex items-center justify-end gap-1 font-semibold">
                            {isPositive ? <ArrowUp className="w-4 h-4"/> : <ArrowDown className="w-4 h-4"/>}
                            <span>₹{Math.abs(data.change).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-xs font-medium">({isPositive ? '+' : ''}{data.percentChange}%)</p>
                    </div>
                </div>
                 <Button variant="secondary" className="w-full bg-card/80 group-hover:bg-card transition-colors">
                    <ShoppingCart className="w-4 h-4 mr-2"/>
                    List for Sale
                </Button>
            </CardContent>
        </Card>
    );
}
