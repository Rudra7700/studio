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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { TreatmentRecommendation, TreatmentRecommendationProps } from './treatment-recommendation';

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
    disease: string;
  };
}

function finalizeDetection(detection: any): any {
  const pc = Number(detection.presence_confidence || 0);
  const sc = Number(detection.severity_confidence || pc);
  const area = Number(detection.infected_area_pct || 0);
  let hs = Number(detection.health_score ?? (100 - area));

  if (hs > 85 && area > 5) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — lesions detected; manual review required";
    return detection;
  }

  if (pc >= 0.6 && hs > 85 && sc < 0.75) {
    detection.reviewRequired = true;
    detection.finalHealthDisplay = "Uncertain — low severity confidence; manual review required";
    return detection;
  }

  if (area >= 5 && pc >= 0.5) {
    detection.infected = true;
    detection.infectionLevel = area <= 5 ? "Preventive" : area <= 25 ? "Targeted" : "Intensive";
    detection.reviewRequired = sc < 0.75;
    detection.finalHealthDisplay = `${Math.max(0, 100 - Math.round(area))}/100 (estimated)`;
    return detection;
  }

  detection.reviewRequired = pc >= 0.5 && pc < 0.75;
  detection.finalHealthDisplay = `${Math.round(hs)}/100`;
  return detection;
}


export function DiseaseDetection({ field }: { field: Field }) {
    const [image, setImage] = useState<string | null>(null);
    const [status, setStatus] = useState<DetectionStatus>('idle');
    const [result, setResult] = useState<DetectionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showTreatmentModal, setShowTreatmentModal] = useState(false);
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
                
                startTransition(() => {
                    setTimeout(() => {
                        try {
                            const mockPresenceConfidence = 0.65 + Math.random() * 0.3;
                            const mockInfectedArea = Math.random() * 40;
                            const infectionLevel =
                                mockPresenceConfidence < 0.6 ? "None" :
                                mockInfectedArea < 5 ? "Preventive" :
                                mockInfectedArea <= 25 ? "Targeted" : "Intensive";

                            let doc = {
                                infected: infectionLevel !== "None",
                                infected_area_pct: Number(mockInfectedArea),
                                infectionLevel,
                                presence_confidence: Number(mockPresenceConfidence),
                                severity_confidence: Number(mockPresenceConfidence - 0.1),
                                health_score: 100 - (Number(mockInfectedArea) * 1.5),
                                disease: field.cropType === 'Corn' ? 'Northern Corn Leaf Blight' : field.cropType === 'Wheat' ? 'Wheat Rust' : 'Powdery Mildew'
                            };

                            const finalDoc = finalizeDetection(doc);

                            const data: DetectionResult = {
                                detectionId: `sim-${Date.now()}`,
                                detection: finalDoc,
                            };
                            
                            setResult(data);
                            setStatus('complete');
                        } catch (err: any) {
                            console.error("Client-side detection error:", err);
                            setError(err.message || 'An unknown error occurred during analysis.');
                            setStatus('error');
                        }
                    }, 1000);
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
    
    const treatmentProps: TreatmentRecommendationProps | null = result ? {
        diseaseDetected: result.detection.disease,
        cropStage: "Vegetative", // Mock data
        weatherConditions: "28°C, 75% Humidity", // Mock data
    } : null;


    return (
        <>
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
                                        <strong>Detected Issue:</strong> {result.detection.disease}
                                    </p>
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
                        <Button className="w-full" disabled={isPending} onClick={() => setShowTreatmentModal(true)}>
                            <TestTube2 className="mr-2 h-4 w-4" />
                            View Recommended Treatment
                        </Button>
                    </CardFooter>
                )}
            </Card>
            {showTreatmentModal && treatmentProps && (
                 <Dialog open={showTreatmentModal} onOpenChange={setShowTreatmentModal}>
                    <DialogContent className="max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>AI Treatment Recommendation</DialogTitle>
                            <DialogDescription>
                                AI-generated treatment plan for {treatmentProps.diseaseDetected} in {field.name}.
                            </DialogDescription>
                        </DialogHeader>
                        <TreatmentRecommendation {...treatmentProps} />
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
