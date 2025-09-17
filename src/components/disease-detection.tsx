'use client';
import { useState, useTransition, ChangeEvent } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Bot, Loader2, Sparkles, TestTube2 } from 'lucide-react';
import type { Field } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getTreatmentPlan } from '@/app/actions';

type DetectionStatus = 'idle' | 'uploading' | 'analyzing' | 'complete';
type HealthScore = 'Healthy' | 'Mild' | 'Severe' | 'Unknown';

const healthInfo: Record<HealthScore, { color: string; score: number; description: string, disease: string }> = {
    Healthy: { color: 'bg-green-500', score: 95, description: 'No significant disease detected.', disease: 'None' },
    Mild: { color: 'bg-yellow-500', score: 65, description: 'Minor symptoms of Leaf Rust detected.', disease: 'Leaf Rust' },
    Severe: { color: 'bg-red-500', score: 25, description: 'Advanced stage of Powdery Mildew detected.', disease: 'Powdery Mildew' },
    Unknown: { color: 'bg-gray-500', score: 0, description: 'Could not determine health status.', disease: 'Unknown' },
};

export function DiseaseDetection({ field }: { field: Field }) {
    const [image, setImage] = useState<string | null>(null);
    const [status, setStatus] = useState<DetectionStatus>('idle');
    const [health, setHealth] = useState<HealthScore>('Unknown');
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadstart = () => {
                setStatus('uploading');
                setHealth('Unknown');
                setRecommendation(null);
            };
            reader.onloadend = () => {
                setImage(reader.result as string);
                setStatus('analyzing');
                // Simulate analysis
                setTimeout(() => {
                    const scores: HealthScore[] = ['Healthy', 'Mild', 'Severe'];
                    const result = scores[Math.floor(Math.random() * scores.length)];
                    setHealth(result);
                    setStatus('complete');
                }, 2000);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGetRecommendation = () => {
        if(health === 'Healthy' || health === 'Unknown') return;
        
        startTransition(async () => {
            const result = await getTreatmentPlan({
                diseaseDetected: healthInfo[health].disease,
                weatherConditions: '28°C, 75% humidity, light winds',
                cropStage: 'Flowering',
            });

            if(result.success && result.data) {
                setRecommendation(result.data.treatmentRecommendations);
            } else {
                setRecommendation("Failed to retrieve recommendations. Please try again.");
            }
        });
    }

    const reset = () => {
        setImage(null);
        setStatus('idle');
        setHealth('Unknown');
        setRecommendation(null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>AI Disease Detection</CardTitle>
                <CardDescription>Upload a crop image to analyze its health.</CardDescription>
            </CardHeader>
            <CardContent>
                {status === 'idle' && (
                    <div className="flex items-center justify-center w-full">
                        <Label htmlFor="crop-image" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-card-foreground/5">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                            </div>
                            <Input id="crop-image" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </Label>
                    </div>
                )}
                
                {(status === 'uploading' || status === 'analyzing' || status === 'complete') && image && (
                     <div className="space-y-4">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                           <Image src={image} alt="Uploaded crop" layout="fill" objectFit="cover" />
                           <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={reset}><X className="h-4 w-4" /></Button>
                        </div>
                        
                        {status === 'analyzing' && <p className="text-sm text-center flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/>Analyzing image...</p>}
                        
                        {status === 'complete' && (
                             <div className="p-4 bg-card-foreground/5 rounded-lg space-y-4">
                                <div className="text-sm font-medium">Analysis Complete</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm items-center">
                                        <span className="font-semibold">Health Score</span>
                                        <Badge variant="outline" className={cn(healthInfo[health].color, "text-white")}>{healthInfo[health].score}/100</Badge>
                                    </div>
                                    <Progress value={healthInfo[health].score} className={cn('h-2', healthInfo[health].color)} />
                                </div>
                                <p className="text-sm text-muted-foreground"><strong>Diagnosis:</strong> {healthInfo[health].description}</p>
                                
                                {recommendation && (
                                     <Card className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                <TestTube2 className="w-5 h-5 text-primary"/> AI Treatment Plan
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm whitespace-pre-wrap font-mono">{recommendation}</p>
                                        </CardContent>
                                    </Card>
                                )}
                             </div>
                        )}
                     </div>
                )}
            </CardContent>
            {status === 'complete' && health !== 'Healthy' && health !== 'Unknown' && (
                 <CardFooter>
                    <Button className="w-full" onClick={handleGetRecommendation} disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isPending ? 'Generating...' : 'Get AI Recommendation'}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}