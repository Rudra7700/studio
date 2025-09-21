'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLiveMandiPrices } from '@/lib/mock-data';
import { MandiPriceCard } from '@/components/mandi-price-card';
import { TrendingUp } from 'lucide-react';

const categories = Object.keys(mockLiveMandiPrices);

export default function MarketPage() {
    const [activeTab, setActiveTab] = useState(categories[0]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-7 w-7 text-green-600"/>
                    <h1 className="text-2xl font-bold font-headline">Live Mandi Prices</h1>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto flex-wrap">
                    {categories.map(category => (
                        <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(category => (
                    <TabsContent key={category} value={category} className="mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {mockLiveMandiPrices[category].map(priceData => (
                                <MandiPriceCard key={priceData.name} data={priceData} />
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
