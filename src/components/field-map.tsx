import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import type { Field } from '@/lib/types';

export function FieldMap({ field }: { field: Field }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Field Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted">
          {/* This is a placeholder map. A real implementation would use a mapping library like Mapbox or Google Maps. */}
          <Image 
            src="https://images.unsplash.com/photo-1649898919283-e8f6276f3fec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxmaWxlZHxlbnwwfHx8fDE3NTg0NzM3NjB8MA&ixlib=rb-4.1.0&q=80&w=1080" 
            alt="Map of the field" 
            layout="fill" 
            objectFit="cover"
            data-ai-hint="map aerial"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Simulate boundary */}
            <div className="absolute w-[80%] h-[70%] border-2 border-dashed border-blue-400 rounded-md" />
            
            {/* Simulate detected area */}
            {field.healthStatus !== 'Healthy' && (
                <div 
                    className="absolute w-[30%] h-[30%] bg-red-500/40 border-2 border-red-600 rounded-full animate-pulse"
                    style={{ top: '25%', left: '55%' }}
                />
            )}

            <div className="absolute top-2 left-2 bg-background/80 p-2 rounded-md text-xs">
                <p className="font-bold">{field.name}</p>
                <p>GPS: {field.gpsCoordinates.lat.toFixed(4)}, {field.gpsCoordinates.lng.toFixed(4)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
