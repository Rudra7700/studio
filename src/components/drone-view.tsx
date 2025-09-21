
'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, Loader2, Play, AlertTriangle, Video, Power } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DroneTelemetry, type TelemetryData } from './drone-telemetry';
import { MissionProgress } from './mission-progress';

type MissionStatus = 'idle' | 'starting' | 'in-progress' | 'complete';

const MISSION_DURATION_MS = 30000; // 30 seconds

export function DroneView() {
    const [missionStatus, setMissionStatus] = useState<MissionStatus>('idle');
    const [telemetry, setTelemetry] = useState<TelemetryData>({
        altitude: 0,
        speed: 0,
        battery: 100,
        tankLevel: 100,
        connection: 'Strong',
        gps: 'Acquiring...'
    });
    const [progress, setProgress] = useState(0);
    const missionTimerRef = useRef<NodeJS.Timeout>();
    const telemetryIntervalRef = useRef<NodeJS.Timeout>();
    const { toast } = useToast();

    useEffect(() => {
        return () => {
            clearInterval(missionTimerRef.current);
            clearInterval(telemetryIntervalRef.current);
        };
    }, []);
    
    const updateTelemetry = () => {
        setTelemetry(prev => {
            const newBattery = Math.max(0, prev.battery - Math.random() * 0.5);
            const newTank = Math.max(0, prev.tankLevel - Math.random() * 1.5);
            const newAltitude = 45 + Math.random() * 10; // 45-55m
            const newSpeed = 12 + Math.random() * 6; // 12-18km/h

            return {
                ...prev,
                altitude: parseFloat(newAltitude.toFixed(1)),
                speed: parseFloat(newSpeed.toFixed(1)),
                battery: parseFloat(newBattery.toFixed(1)),
                tankLevel: parseFloat(newTank.toFixed(1)),
                connection: Math.random() > 0.1 ? 'Strong' : 'Weak',
            }
        })
    };

    const handleStartMission = () => {
        setMissionStatus('starting');
        setProgress(0);
        toast({ title: "Starting mission...", description: "Drone is taking off." });
        
        // Initial telemetry
        setTelemetry({
            altitude: 0,
            speed: 0,
            battery: 98,
            tankLevel: 100,
            connection: 'Strong',
            gps: 'Acquiring...'
        });

        // Simulate takeoff and GPS lock
        setTimeout(() => {
            toast({ title: "GPS lock acquired ✓" });
            setTelemetry(prev => ({...prev, gps: 'Locked (5 Satellites)'}));
        }, 2000);

        setTimeout(() => {
            setMissionStatus('in-progress');
            toast({ title: "Mission in progress.", description: "Starting crop health survey." });

            const startTime = Date.now();
            missionTimerRef.current = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const currentProgress = Math.min(100, (elapsedTime / MISSION_DURATION_MS) * 100);
                setProgress(currentProgress);

                if (currentProgress >= 100) {
                    handleMissionComplete();
                }
            }, 100);
            
            telemetryIntervalRef.current = setInterval(updateTelemetry, 1000);

        }, 4000);
    };

    const handleMissionComplete = () => {
        clearInterval(missionTimerRef.current);
        clearInterval(telemetryIntervalRef.current);
        setMissionStatus('complete');
        setProgress(100);
        toast({ title: "Mission complete!", description: "Drone is returning to base." });
         setTimeout(() => {
            setMissionStatus('idle');
             setTelemetry({
                altitude: 0,
                speed: 0,
                battery: telemetry.battery,
                tankLevel: telemetry.tankLevel,
                connection: 'Connected',
                gps: 'On Base'
            });
        }, 5000);
    }
    
    return (
        <div className="mt-4">
            <div className="flex justify-between items-center bg-card-foreground/5 p-2 rounded-t-lg border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2 pl-2">
                    <Camera className="w-5 h-5"/>
                    Drone Live Feed
                </h3>
            </div>

            <div className="relative aspect-video w-full bg-slate-800 rounded-b-lg overflow-hidden flex items-center justify-center">
                 <Image 
                    src="https://picsum.photos/seed/dronefeed/1280/720"
                    alt="Drone flying over a field"
                    fill
                    objectFit="cover"
                    className="opacity-70"
                    data-ai-hint="drone aerial view farm"
                 />

                {missionStatus === 'idle' && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 text-center z-10">
                        <CameraOff className="w-16 h-16 text-muted-foreground" />
                        <h3 className="mt-4 text-xl font-semibold">Feed Standby</h3>
                        <p className="text-muted-foreground">Start a mission to activate live feed.</p>
                        <Button onClick={handleStartMission} className="mt-6">
                            <Play className="w-4 h-4 mr-2"/>
                            Start Mission
                        </Button>
                    </div>
                )}
                
                {missionStatus === 'starting' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 text-center z-10">
                        <Loader2 className="w-16 h-16 text-muted-foreground animate-spin" />
                         <h3 className="mt-4 text-xl font-semibold">Preparing for Takeoff...</h3>
                         <p className="text-muted-foreground">Calibrating sensors and acquiring GPS.</p>
                    </div>
                )}
                
                {(missionStatus === 'in-progress' || missionStatus === 'complete') && (
                    <>
                        <DroneTelemetry data={telemetry} />
                        <div className="absolute bottom-4 left-4 right-4 z-20">
                            <MissionProgress 
                                progress={progress} 
                                photosTaken={Math.floor((progress/100) * 120)}
                                areaCovered={parseFloat(((progress/100) * 2.5).toFixed(2))}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
