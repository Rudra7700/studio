
'use client';

import { DroneView } from '@/components/drone-view';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Map, SprayCan, Play, Pause, StopCircle, RefreshCw, ZoomIn, ZoomOut, Video } from 'lucide-react';

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
             <Tabs defaultValue="live-feed">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="live-feed">
                        <Camera className="mr-2 h-4 w-4" /> Live Feed
                    </TabsTrigger>
                    <TabsTrigger value="flight-plan">
                        <Map className="mr-2 h-4 w-4" /> Flight Plan
                    </TabsTrigger>
                    <TabsTrigger value="spray-controls">
                        <SprayCan className="mr-2 h-4 w-4" /> Spray Controls
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="live-feed">
                   <DroneView />
                </TabsContent>
                <TabsContent value="flight-plan">
                    <div className="p-8 text-center text-muted-foreground">
                        <Map className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">Flight Plan</h3>
                        <p>Flight planning features are coming soon.</p>
                    </div>
                </TabsContent>
                 <TabsContent value="spray-controls">
                    <div className="p-8 text-center text-muted-foreground">
                        <SprayCan className="mx-auto h-12 w-12 mb-4" />
                        <h3 className="text-lg font-semibold">Spray Controls</h3>
                        <p>Spraying controls will be available here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
