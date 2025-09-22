

'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, PiggyBank, BarChart, ShoppingCart, Tractor } from 'lucide-react';
import { format } from 'date-fns';
import { mockWallet, mockTransactions } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { StatsCard } from '@/components/stats-card';
import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useEffect, useState } from 'react';

const initialChartData = [
  { month: 'Jan', savings: 45000 },
  { month: 'Feb', savings: 48000 },
  { month: 'Mar', savings: 47000 },
  { month: 'Apr', savings: 52000 },
  { month: 'May', savings: 65000 },
  { month: 'Jun', savings: 78000 },
];

const chartConfig = {
  savings: {
    label: 'Savings',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export default function FinancialsPage() {
    const [wallet, setWallet] = useState(mockWallet);
    const [transactions, setTransactions] = useState(mockTransactions);
    const [chartData, setChartData] = useState(initialChartData);
    
    useEffect(() => {
        // In a real app, you would fetch this data or get it from a global state management library
        const newWallet = {
            currentBalance: transactions.reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0),
            totalIncome: transactions.filter(tx => tx.type === 'income').reduce((acc, tx) => acc + tx.amount, 0),
            totalExpenses: transactions.filter(tx => tx.type === 'expense').reduce((acc, tx) => acc + tx.amount, 0),
        };
        setWallet(newWallet);
        
        // Update chart
        const lastMonthSavings = newWallet.currentBalance - transactions.filter(tx => new Date(tx.date) > new Date(new Date().setMonth(new Date().getMonth() - 1))).reduce((acc, tx) => acc + (tx.type === 'income' ? tx.amount : -tx.amount), 0);
        const newChartData = [...initialChartData.slice(0, -1), { month: 'Jun', savings: newWallet.currentBalance }];
        
        // A bit of a hack to make the chart look like it's updating
        newChartData[newChartData.length-2].savings = lastMonthSavings > 0 ? lastMonthSavings : initialChartData[initialChartData.length-2].savings;
        setChartData(newChartData);

    }, [transactions]);
    
    const { currentBalance, totalIncome, totalExpenses } = wallet;
    const netProfit = totalIncome - totalExpenses;

    return (
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
                        <PiggyBank className="w-7 h-7 text-primary" />
                        Financial Summary
                    </h1>
                    <p className="text-muted-foreground">Track your income, expenses, and overall farm profitability.</p>
                </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <StatsCard 
                    title="Current Savings" 
                    value={`₹${currentBalance.toLocaleString('en-IN')}`}
                    icon={<PiggyBank className="h-4 w-4" />}
                    description="+₹5,200 this month"
                />
                <StatsCard 
                    title="Total Income" 
                    value={`₹${totalIncome.toLocaleString('en-IN')}`}
                    icon={<ArrowUpRight className="h-4 w-4" />}
                    description="From crop sales"
                    className="border-green-500/50 bg-green-500/10"
                />
                <StatsCard 
                    title="Total Expenses" 
                    value={`₹${totalExpenses.toLocaleString('en-IN')}`}
                    icon={<ArrowDownLeft className="h-4 w-4" />}
                    description="Pesticides & Supplies"
                    className="border-red-500/50 bg-red-500/10"
                />
                <StatsCard 
                    title="Net Profit" 
                    value={`₹${netProfit.toLocaleString('en-IN')}`}
                    icon={<BarChart className="h-4 w-4" />}
                    description="YTD"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>A log of your recent income and expenses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map(tx => (
                                    <TableRow key={tx.id}>
                                        <TableCell className="text-muted-foreground text-xs">{format(new Date(tx.date), 'PP')}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{tx.description}</div>
                                            {tx.category && <div className="text-xs text-muted-foreground">{tx.category}</div>}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={tx.type === 'income' ? 'default' : 'destructive'} className={cn(
                                                tx.type === 'income' && 'bg-green-500/20 text-green-700 border-green-500/30 hover:bg-green-500/30',
                                                tx.type === 'expense' && 'bg-red-500/20 text-red-700 border-red-500/30 hover:bg-red-500/30'
                                            )}>{tx.type}</Badge>
                                        </TableCell>
                                        <TableCell className={cn("text-right font-bold", tx.type === 'income' ? 'text-green-600' : 'text-red-600')}>
                                            {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Savings Over Time</CardTitle>
                        <CardDescription>Your account balance over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[250px] w-full">
                            <AreaChart data={chartData} margin={{ left: -20, right: 20, top: 5, bottom: 0 }}>
                                 <defs>
                                    <linearGradient id="fillSavings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-savings)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-savings)" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value.slice(0, 3)}
                                />
                                <Tooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}/>} />
                                <Area dataKey="savings" type="natural" fill="url(#fillSavings)" stroke="var(--color-savings)" stackId="a" />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
