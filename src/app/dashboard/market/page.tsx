'use client';
import { useState, useTransition } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockMandiPrices } from '@/lib/mock-data';
import { format, subDays } from 'date-fns';
import { Loader2, Search, TrendingUp, MapPin } from 'lucide-react';
import { ShowMandiPriceOutput, showMandiPrice } from '@/ai/flows/show-mandi-price';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const chartConfig = {
  price: {
    label: 'Price (₹/Quintal)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function MarketPage() {
    const [crop, setCrop] = useState('Wheat');
    const [location, setLocation] = useState('Indore');
    const [isPending, startTransition] = useTransition();
    const [priceData, setPriceData] = useState<ShowMandiPriceOutput | null>(mockMandiPrices);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = () => {
        if (!crop || !location) return;
        setError(null);
        startTransition(async () => {
            const result = await showMandiPrice({ crop, location });
            if (result && !('error' in result)) {
                setPriceData(result);
            } else {
                setError('Could not fetch real-time price data. Displaying mock data.');
                setPriceData(mockMandiPrices);
            }
        });
    }

    const priceTrendData = priceData?.priceTrend.map(d => ({...d, date: format(new Date(d.date), 'MMM d')})) || [];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-2xl font-bold font-headline">Mandi Prices</h1>
                <p className="text-muted-foreground">Real-time market prices for your crops.</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Input placeholder="Enter crop name" value={crop} onChange={(e) => setCrop(e.target.value)} className="sm:w-1/3" />
                        <Input placeholder="Enter location (e.g., city)" value={location} onChange={(e) => setLocation(e.target.value)} className="sm:w-1/3" />
                        <Button onClick={handleSearch} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                            Search Prices
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {error && <Alert variant="destructive" className="mb-4"><AlertDescription>{error}</AlertDescription></Alert>}
                    
                    {isPending && <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}

                    {!isPending && priceData && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">Current Price in {location}</CardTitle>
                                        <CardDescription>{crop}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-4xl font-bold">₹{priceData.currentPrice.toLocaleString('en-IN')} / Quintal</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Nearby Mandis</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {priceData.nearbyMandis.map(mandi => (
                                            <div key={mandi.mandiName} className="flex justify-between items-center text-sm">
                                                <p className="font-medium">{mandi.mandiName}</p>
                                                <p className="font-semibold">₹{mandi.price.toLocaleString('en-IN')}</p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="lg:col-span-2 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/> Price Trend (Last 7 Days)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                         <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                                            <LineChart data={priceTrendData} accessibilityLayer margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                <CartesianGrid vertical={false} />
                                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                                                <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                                                <Tooltip content={<ChartTooltipContent />} />
                                                <Line type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} />
                                            </LineChart>
                                        </ChartContainer>
                                    </CardContent>
                                </Card>
                                 <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg">AI Market Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{priceData.priceAnalysis}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
