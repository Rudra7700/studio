
'use client';

import type { MandiPriceCardData } from "@/lib/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { MapPin, ArrowUp, ArrowDown, Image as ImageIcon, CircleDollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import Image from "next/image";

interface MandiPriceCardProps {
    data: MandiPriceCardData;
    onSellClick: (data: MandiPriceCardData) => void;
}

export function MandiPriceCard({ data, onSellClick }: MandiPriceCardProps) {
    const isPositive = data.change >= 0;
    const isPlaceholder = data.imageUrl.includes('picsum.photos');

    return (
        <Card className="bg-primary/5 hover:bg-primary/10 transition-colors group flex flex-col">
            <CardHeader className="p-0">
                 <div className="relative aspect-video w-full">
                    {isPlaceholder ? (
                        <div className="w-full h-full bg-muted flex flex-col items-center justify-center gap-2 text-muted-foreground rounded-t-lg">
                           <ImageIcon className="w-8 h-8" />
                           <p className="text-xs">Generating image...</p>
                        </div>
                    ) : (
                       <Image 
                            src={data.imageUrl} 
                            alt={data.name} 
                            fill 
                            objectFit="cover" 
                            className="rounded-t-lg"
                            data-ai-hint={data.imageHint}
                            unoptimized={data.imageUrl.startsWith('data:image')}
                        />
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 flex-grow flex flex-col">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-foreground">{data.name}</h3>
                    <div className="text-xs inline-flex items-center gap-1.5 bg-card px-2 py-1 rounded-full text-muted-foreground">
                        <MapPin className="w-3 h-3"/>
                        {data.mandi}
                    </div>
                </div>

                <div className="flex justify-between items-end flex-grow">
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
                 <Button variant="default" className="w-full mt-3" onClick={() => onSellClick(data)}>
                    <CircleDollarSign className="w-4 h-4 mr-2"/>
                    Sell Crop
                </Button>
            </CardContent>
        </Card>
    );
}
