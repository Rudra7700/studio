
'use client';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, Loader2, RefreshCw, Video, VideoOff, ZoomIn, ZoomOut, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function DroneView() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isFeedActive, setIsFeedActive] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this app.',
            });
          }
        };
    
        if(isFeedActive) {
            getCameraPermission();
        } else {
            if(videoRef.current && videoRef.current.srcObject){
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setHasCameraPermission(null);
        }
      }, [isFeedActive, toast]);

    const handleStartFeed = () => {
        setIsFeedActive(true);
    };

    const handleStopFeed = () => {
        setIsFeedActive(false);
    }
    
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center bg-card-foreground/5 p-2 rounded-t-lg border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2 pl-2">
                    <Camera className="w-5 h-5"/>
                    Live Feed
                </h3>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm"><ZoomIn className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><ZoomOut className="w-4 h-4" /></Button>
                    <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4" /></Button>
                    <Button variant="secondary" size="sm"><Video className="w-4 h-4 mr-2"/>Record</Button>
                </div>
            </div>

            <div className="relative aspect-video w-full bg-slate-800 rounded-b-lg overflow-hidden flex items-center justify-center">
                 <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

                {!isFeedActive && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 text-center z-10">
                        <CameraOff className="w-16 h-16 text-muted-foreground" />
                        <h3 className="mt-4 text-xl font-semibold">Feed Standby</h3>
                        <p className="text-muted-foreground">Start a mission to activate live feed.</p>
                        <Button onClick={handleStartFeed} className="mt-6">Start Mission</Button>
                    </div>
                )}
                
                {isFeedActive && hasCameraPermission === null && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 text-center z-10">
                        <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
                         <h3 className="mt-4 text-xl font-semibold">Requesting Camera...</h3>
                    </div>
                )}

                {isFeedActive && hasCameraPermission === false && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 text-center z-10 p-4">
                        <AlertTriangle className="w-16 h-16 text-destructive" />
                        <h3 className="mt-4 text-xl font-semibold text-destructive-foreground">Camera Access Denied</h3>
                        <p className="text-destructive-foreground/80">Please grant camera permissions in your browser settings to view the feed.</p>
                         <Button onClick={handleStopFeed} variant="destructive" className="mt-6">Return to Standby</Button>
                    </div>
                )}
                
                {isFeedActive && hasCameraPermission && (
                     <div className="absolute bottom-4 right-4 z-20">
                        <Button onClick={handleStopFeed} variant="destructive">
                            <VideoOff className="w-4 h-4 mr-2"/>
                            Stop Feed
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
