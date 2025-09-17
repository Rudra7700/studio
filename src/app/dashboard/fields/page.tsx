
'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { mockFields } from '@/lib/mock-data';
import { FieldMap } from '@/components/field-map';
import { DiseaseDetection } from '@/components/disease-detection';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Field } from '@/lib/types';

const healthStatusStyles: Record<Field['healthStatus'], string> = {
    Healthy: 'bg-green-500/20 text-green-700 border-green-500/30',
    Mild: 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
    Severe: 'bg-red-500/20 text-red-700 border-red-500/30',
    Unknown: 'bg-gray-500/20 text-gray-700 border-gray-500/30',
};

function FieldsPageContent() {
  const searchParams = useSearchParams();
  const fieldId = searchParams.get('fieldId');
  const selectedField = mockFields.find(f => f.id === fieldId) || mockFields[0];

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-headline">Field Management</h1>
          <p className="text-muted-foreground">Analyze health and manage your registered fields.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Field
        </Button>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-5 xl:grid-cols-3">
        <div className="lg:col-span-2 xl:col-span-1">
          <Card>
            <CardHeader>
                <CardTitle>All Fields</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                {mockFields.map(field => (
                     <Link href={`/dashboard/fields?fieldId=${field.id}`} key={field.id}>
                        <div className={cn("border p-3 rounded-lg hover:bg-card-foreground/5 transition-colors flex items-center gap-3", field.id === selectedField.id && 'bg-card-foreground/5 ring-2 ring-primary')}>
                            <Image
                                src={field.imageUrl}
                                alt={field.name}
                                width={64}
                                height={48}
                                className="rounded-md object-cover"
                                data-ai-hint={field.imageHint}
                            />
                            <div className="flex-grow">
                                <p className="font-semibold text-sm">{field.name}</p>
                                <p className="text-xs text-muted-foreground">{field.cropType}</p>
                            </div>
                            <Badge variant="outline" className={cn("text-xs", healthStatusStyles[field.healthStatus])}>{field.healthStatus}</Badge>
                        </div>
                    </Link>
                ))}
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-3 xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <DiseaseDetection field={selectedField} />
            <FieldMap field={selectedField} />
        </div>
      </div>
    </>
  );
}

export default function FieldsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FieldsPageContent />
        </Suspense>
    );
}
