'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockLiveMandiPrices } from '@/lib/mock-data';
import type { MandiPriceCardData } from '@/lib/types';
import { MandiPriceCard } from '@/components/mandi-price-card';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function MarketPage() {
    const [prices, setPrices] = useState<Record<string, MandiPriceCardData[]>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const mockData = generateMockLiveMandiPrices();
        const cats = Object.keys(mockData);
        setPrices(mockData);
        setCategories(cats);
        setActiveTab(cats[0]);
        setLoading(false);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-7 w-7 text-green-600"/>
                    <h1 className="text-2xl font-bold font-headline">Live Mandi Prices</h1>
                </div>
            </div>
            
            {loading ? (
                 <div className="w-full">
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                             <div key={i} className="space-y-2">
                                <Skeleton className="h-40 w-full" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-8 w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto flex-wrap">
                        {categories.map(category => (
                            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                        ))}
                    </TabsList>

                    {categories.map(category => (
                        <TabsContent key={category} value={category} className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {prices[category]?.map(priceData => (
                                    <MandiPriceCard key={priceData.name} data={priceData} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
}