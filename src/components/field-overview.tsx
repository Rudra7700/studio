'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFields } from '@/lib/mock-data';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { format, addDays } from 'date-fns';
import { FileText, Scan, ChevronDown } from 'lucide-react';
import { FieldHealthChart } from './field-health-chart';

const healthStatusStyles: Record<string, string> = {
    Healthy: 'border-green-500/80',
    Mild: 'border-yellow-500/80',
    Severe: 'border-red-500/80',
    Unknown: 'border-gray-500/80',
};

const healthBadgeStyles: Record<string, string> = {
    Healthy: 'bg-green-500/20 text-green-700 border-green-500/30',
    Mild: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    Severe: 'bg-red-500/20 text-red-700 border-red-500/30',
    Unknown: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
};

interface FieldOverviewProps {
  onViewReport: (fieldId: string) => void;
  selectedFieldForReport: string | null;
}

export function FieldOverview({ onViewReport, selectedFieldForReport }: FieldOverviewProps) {
    const fields = mockFields.filter(f => f.farmerId === 'farmer-1');

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Fields</CardTitle>
                <CardDescription>An overview of your registered farm fields.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {fields.map(field => {
                        const isReportOpen = selectedFieldForReport === field.id;
                        return (
                            <div key={field.id} className={cn("border-2 p-4 rounded-lg transition-colors flex flex-col gap-4", healthStatusStyles[field.healthStatus])}>
                                <Link href={`/dashboard/fields?fieldId=${field.id}`} className="flex items-center gap-4">
                                    <Image
                                        src={field.imageUrl}
                                        alt={field.name}
                                        width={100}
                                        height={75}
                                        className="rounded-md object-cover"
                                        data-ai-hint={field.imageHint}
                                    />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{field.name}</p>
                                        <p className="text-sm text-muted-foreground">{field.cropType}</p>
                                        <Badge variant="outline" className={cn("mt-1", healthBadgeStyles[field.healthStatus])}>{field.healthStatus}</Badge>
                                    </div>
                                </Link>

                                <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex justify-between">
                                        <span>Last scan:</span>
                                        <span className="font-medium text-foreground">2 hours ago</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Next spray:</span>
                                        <span className="font-medium text-foreground">{format(addDays(new Date(), 2), 'PP')}</span>
                                    </div>
                                </div>
                                
                                <FieldHealthChart />
                                
                                <div className="grid grid-cols-3 items-center gap-2 mt-2">
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <Link href="/dashboard/fields">Details</Link>
                                    </Button>
                                    <Button variant="secondary" size="sm" className="w-full">
                                        <Scan className="mr-2 h-4 w-4" />
                                        Scan
                                    </Button>
                                    <Button 
                                        variant={isReportOpen ? "secondary" : "outline"} 
                                        size="sm" 
                                        className="w-full"
                                        onClick={() => onViewReport(field.id)}
                                    >
                                        <FileText className="mr-2 h-4 w-4" />
                                        Report
                                        <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform", isReportOpen && "rotate-180")} />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                 <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/fields">Manage All Fields</Link>
                 </Button>
            </CardContent>
        </Card>
    );
}
