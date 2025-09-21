
'use client';

import { DroneView } from '@/components/drone-view';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export default function DronesPage() {
  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline flex items-center gap-2">
            <Camera className="w-6 h-6"/>
            Drone View & Controls
        </h1>
      </div>

      <Card>
        <CardContent className="p-4">
            <DroneView />
        </CardContent>
      </Card>
    </div>
  );
}
