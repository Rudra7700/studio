'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockFields } from '@/lib/mock-data';
import type { Field } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const healthStatusStyles = {
    Healthy: 'bg-green-500/20 text-green-700 border-green-500/30',
    Mild: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    Severe: 'bg-red-500/20 text-red-700 border-red-500/30',
    Unknown: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
};

export function FieldOverview() {
    // Assuming one farmer for this view
    const fields = mockFields.filter(f => f.farmerId === 'farmer-1');

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Fields</CardTitle>
                <CardDescription>An overview of your registered farm fields.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {fields.map(field => (
                        <Link href={`/dashboard/fields?fieldId=${field.id}`} key={field.id} className="block">
                            <div className="border p-4 rounded-lg hover:bg-card-foreground/5 transition-colors flex items-center gap-4">
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
                                </div>
                                <Badge variant="outline" className={cn(healthStatusStyles[field.healthStatus])}>{field.healthStatus}</Badge>
                            </div>
                        </Link>
                    ))}
                </div>
                 <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/fields">Manage All Fields</Link>
                 </Button>
            </CardContent>
        </Card>
    );
}
