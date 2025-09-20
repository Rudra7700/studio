'use client';
import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, Sparkles, TestTube2, AlertTriangle } from 'lucide-react';
import type { Field } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

type DetectionStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

interface DetectionResult {
  detectionId: string;
  detection: {
    finalHealthDisplay: string;
    infectionLevel: 'None' | 'Preventive' | 'Targeted' | 'Intensive';
    infected_area_pct: number;
    presence_confidence: number;
    reviewRequired: boolean;
    health_score: number;
  };
  error?: string;
  message?: string;
  sprayerPayload?: any;
}

export function DiseaseDetection({ field }: { field: Field }) {
    const [image, setImage] = useState<string | null>(null);
    const [status, setStatus] = useState<DetectionStatus>('idle');
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onloadstart = () => {
                setStatus('uploading');
                resetState(false);
            };

            reader.onloadend = () => {
                const dataUri = reader.result as string;
                setImage(dataUri);
                setStatus('analyzing');
                
                startTransition(async () => {
                    try {
                        const mockPresenceConfidence = 0.65 + Math.random() * 0.3; // 0.65 - 0.95
                        const mockInfectedArea = Math.random() * 40; // 0 - 40%
                        
                        const payload = {
                            metadata: {
                                deviceId: 'frontend-uploader',
                                timestamp: new Date().toISOString(),
                                cropType: field.cropType,
                                gps: field.gpsCoordinates,
                            },
                            presence_confidence: mockPresenceConfidence,
                            infected_area_pct: mockInfectedArea,
                            severity_confidence: mockPresenceConfidence - 0.1,
                        };

                        const response = await fetch('/api/detect', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload),
                        });

                        const contentType = response.headers.get('content-type');
                        if (!response.ok || !contentType || !contentType.includes('application/json')) {
                            const errorText = await response.text();
                            throw new Error(`Server returned an invalid response: ${errorText.substring(0, 200)}...`);
                        }

                        const data: DetectionResult = await response.json();
                        
                        if(data.error) {
                             throw new Error(data.message || 'The server returned an error.');
                        }

                        setResult(data);
                        setStatus('complete');
                    } catch (err: any) {
                        console.error("Detection error:", err);
                        setError(err.message || 'An unknown error occurred during analysis.');
                        setStatus('error');
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const resetState = (clearImage: boolean = true) => {
        if(clearImage) setImage(null);
        setStatus('idle');
        setResult(null);
        setError(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    const getHealthInfo = () => {
        if (!result) return { color: 'bg-gray-500', score: 0 };
        const score = result.detection.health_score;
        if (score > 85) return { color: 'bg-green-500', score };
        if (score > 50) return { color: 'bg-yellow-500', score };
        return { color: 'bg-red-500', score };
    };

    const healthInfo = getHealthInfo();


    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>AI Disease Detection</CardTitle>
                <CardDescription>Upload a crop image to analyze its health.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                {!image && (
                    <div className="flex items-center justify-center w-full">
                        <Label htmlFor="crop-image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-card-foreground/5">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 10MB)</p>
                            </div>
                            <Input ref={fileInputRef} id="crop-image" type="file" className="hidden" onChange={handleImageChange} accept="image/*" disabled={isPending} />
                        </Label>
                    </div>
                )}
                
                {image && (
                     <div className="space-y-4">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                           <Image src={image} alt="Uploaded crop" layout="fill" objectFit="cover" />
                           <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => resetState(true)} disabled={isPending}><X className="h-4 w-4" /></Button>
                        </div>
                        
                        {(status === 'analyzing' || status === 'uploading') && (
                            <div className="text-sm text-center flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin"/>
                                {status === 'uploading' ? 'Uploading...' : 'Analyzing with AI...'}
                            </div>
                        )}
                        
                        {status === 'error' && error && (
                             <Alert variant="destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertTitle>Analysis Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {status === 'complete' && result && (
                             <div className="p-4 bg-card-foreground/5 rounded-lg space-y-4">
                                <div className="text-sm font-medium">Analysis Complete</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="font-semibold">Health Score</span>
                                        <Badge variant="outline">{result.detection.finalHealthDisplay}</Badge>
                                    </div>
                                    {!result.detection.finalHealthDisplay.includes('Uncertain') && (
                                        <Progress value={healthInfo.score} className={cn('h-2', healthInfo.color)} />
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    <strong>Infection Level:</strong> {result.detection.infectionLevel}
                                </p>
                                {result.detection.reviewRequired && (
                                    <Alert variant="default" className="bg-yellow-500/10 border-yellow-500/50">
                                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                        <AlertTitle className="text-yellow-700">Manual Review Recommended</AlertTitle>
                                        <AlertDescription className="text-yellow-600">
                                            AI confidence is moderate. An expert should review this scan.
                                        </AlertDescription>
                                    </Alert>
                                )}
                             </div>
                        )}
                     </div>
                )}
            </CardContent>
            {status === 'complete' && result && result.detection.infectionLevel !== 'None' && (
                 <CardFooter>
                    <Button className="w-full" disabled={isPending}>
                        <TestTube2 className="mr-2 h-4 w-4" />
                        View Recommended Treatment
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
