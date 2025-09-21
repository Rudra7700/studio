'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockLiveMandiPrices } from '@/lib/mock-data';
import type { MandiPriceCardData } from '@/lib/types';
import { MandiPriceCard } from '@/components/mandi-price-card';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCropImage } from '@/app/actions';

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

    useEffect(() => {
        if (loading) return;

        Object.keys(prices).forEach(category => {
            prices[category].forEach((priceData, index) => {
                // Only generate images for picsum placeholders
                if (priceData.imageUrl.includes('picsum.photos')) {
                    getCropImage({ cropName: priceData.name })
                        .then(result => {
                            if (result.success && result.data) {
                                setPrices(prevPrices => {
                                    const newPrices = { ...prevPrices };
                                    if (newPrices[category]) {
                                        const items = [...newPrices[category]];
                                        items[index] = { ...items[index], imageUrl: result.data.imageUrl, imageHint: `ai-generated ${priceData.name}`};
                                        newPrices[category] = items;
                                        return newPrices;
                                    }
                                    return prevPrices;
                                });
                            }
                        })
                        .catch(err => console.error(`Failed to generate image for ${priceData.name}`, err));
                }
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, prices]);


    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-7 w-7 text-green-600"/>
                    <h1 className="text-2xl font-bold font-headline">Live Mandi Prices</h1>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 rounded-lg bg-card border">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span>AI-generated images</span>
                </div>
            </div>
            
            {loading ? (
                 <div className="w-full">
                    <Skeleton className="h-10 w-1/2 mb-4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {[...Array(8)].map((_, i) => (
                             <div key={i} className="space-y-2 rounded-lg border bg-card p-4">
                                <Skeleton className="h-32 w-full" />
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
