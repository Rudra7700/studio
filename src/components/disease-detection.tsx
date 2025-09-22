'use client';
import { useState, useTransition, ChangeEvent, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Loader2, Sparkles, TestTube2, AlertTriangle, Microscope } from 'lucide-react';
import type { Field } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { TreatmentRecommendation, TreatmentRecommendationProps } from './treatment-recommendation';
import { diagnosePlantHealth } from '@/app/actions';
import type { DiagnosePlantOutput } from '@/ai/flows/diagnose-plant.types';

type DetectionStatus = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';


export function DiseaseDetection({ field }: { field: Field }) {
    const [image, setImage] = useState<string | null>(null);
    const [status, setStatus] = useState<DetectionStatus>('idle');
    const [result, setResult] = useState<DiagnosePlantOutput | null>(null);
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
                
                startTransition(async () => {
                    const response = await diagnosePlantHealth({
                        photoDataUri: dataUri,
                        description: `Image of a ${field.cropType} plant from ${field.name}.`,
                    });

                    if (response.success && response.data) {
                        setResult(response.data);
                        setStatus('complete');
                    } else {
                        setError(response.error || 'An unknown error occurred during analysis.');
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
        const score = result.diagnosis.healthScore;
        if (score > 85) return { color: 'bg-green-500', score };
        if (score > 50) return { color: 'bg-yellow-500', score };
        return { color: 'bg-red-500', score };
    };

    const healthInfo = getHealthInfo();
    
    const treatmentProps: TreatmentRecommendationProps | null = result && !result.diagnosis.isHealthy ? {
        diseaseDetected: result.diagnosis.disease,
        cropStage: "Vegetative", // Mock data
        weatherConditions: "28°C, 75% Humidity", // Mock data
    } : null;


    return (
        <>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Microscope/> AI Disease Detection</CardTitle>
                    <CardDescription>Upload a crop image to analyze its health using Gemini.</CardDescription>
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
                                            <Badge variant="outline">{result.diagnosis.healthScore}/100</Badge>
                                        </div>
                                        <Progress value={healthInfo.score} className={cn('h-2', healthInfo.color)} />
                                    </div>
                                    <div className='text-sm space-y-2'>
                                        <p><strong>Plant:</strong> {result.identification.commonName} <i>({result.identification.latinName})</i></p>
                                        <p><strong>Status:</strong> <span className={result.diagnosis.isHealthy ? 'text-green-600' : 'text-red-600'}>{result.diagnosis.isHealthy ? 'Healthy' : 'Diseased'}</span></p>
                                        <p><strong>Issue:</strong> {result.diagnosis.disease}</p>
                                        <Card className="bg-background/50 max-h-32 overflow-y-auto">
                                            <CardHeader className="p-2 pt-2">
                                                <CardTitle className="text-xs">Detailed Diagnosis</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-2 pt-0 text-xs">
                                                {result.diagnosis.detailedDiagnosis}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
                {status === 'complete' && result && !result.diagnosis.isHealthy && (
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
