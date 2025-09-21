
'use client';
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockLiveMandiPrices, mockInventory } from '@/lib/mock-data';
import type { MandiPriceCardData } from '@/lib/types';
import { MandiPriceCard } from '@/components/mandi-price-card';
import { TrendingUp, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getCropImage } from '@/app/actions';
import { SellCropModal } from '@/components/sell-crop-modal';

export default function MarketPage() {
    const [prices, setPrices] = useState<Record<string, MandiPriceCardData[]>>({});
    const [categories, setCategories] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [selectedCrop, setSelectedCrop] = useState<MandiPriceCardData | null>(null);

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

        const updateOrGenerateImages = async () => {
            const allCrops = Object.entries(prices).flatMap(([category, crops]) => 
                crops.map((crop, index) => ({ ...crop, category, index }))
            );

            const cropsToGenerate = allCrops.filter(crop => crop.imageUrl.includes('picsum.photos'));

            for (const crop of cropsToGenerate) {
                try {
                    const result = await getCropImage({ cropName: crop.name });
                    if (result.success && result.data) {
                        setPrices(prevPrices => {
                            const newPrices = { ...prevPrices };
                            const items = [...newPrices[crop.category]];
                            items[crop.index] = { ...items[crop.index], imageUrl: result.data.imageUrl, imageHint: `ai-generated ${crop.name}` };
                            newPrices[crop.category] = items;
                            return newPrices;
                        });
                    }
                } catch (err) {
                    console.error(`Failed to generate image for ${crop.name}`, err);
                }
            }
        };

        updateOrGenerateImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    const handleSellClick = (cropData: MandiPriceCardData) => {
        setSelectedCrop(cropData);
    }

    const handleModalClose = () => {
        setSelectedCrop(null);
    }

    const inventory = selectedCrop ? mockInventory[selectedCrop.name] || { quantity: 0, unit: 'quintals' } : null;

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
                                    <MandiPriceCard key={priceData.name} data={priceData} onSellClick={handleSellClick} />
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            )}

            {selectedCrop && inventory && (
                <SellCropModal 
                    isOpen={!!selectedCrop}
                    onClose={handleModalClose}
                    crop={selectedCrop}
                    inventory={inventory}
                />
            )}
        </div>
    );
}

