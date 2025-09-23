
'use client';
import { useState, useTransition, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { generateCropReport } from "@/app/actions";
import { mockFields, mockSensorData } from "@/lib/mock-data";
import { Bot, FileText, Loader2, Sparkles } from "lucide-react";
import { FieldHealthChart } from './field-health-chart';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';

export function CropReport({ fieldId }: { fieldId: string }) {
    const [report, setReport] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const field = mockFields.find(f => f.id === fieldId);

    useEffect(() => {
        setReport(null);
        setError(null);
        if (!field) return;

        startTransition(async () => {
            const result = await generateCropReport(field.id);
            if (result.success && result.data) {
                setReport(result.data.report);
            } else {
                setError(result.error || "An unexpected error occurred.");
            }
        });
    }, [fieldId, field]);

    if (!field) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Crop Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Field not found.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card className="bg-card-foreground/5 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Crop Health Report: {field.name}
                </CardTitle>
                <CardDescription>
                    AI-generated summary and recommendations for {field.name} ({field.cropType}).
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="w-5 h-5 text-accent"/> AI Narrative & Recommendations</h3>
                        {isPending && (
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <p>Generating AI report...</p>
                            </div>
                        )}
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Report Generation Failed</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {report && (
                            <div className="text-sm prose prose-sm dark:prose-invert max-w-full">
                                <p className="whitespace-pre-wrap font-mono bg-background/50 p-4 rounded-md">{report}</p>
                            </div>
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Data Trends</h3>
                        <div>
                            <p className="text-sm font-medium">Health Trend (30 Days)</p>
                            <FieldHealthChart />
                        </div>
                         <div>
                            <p className="text-sm font-medium mb-2">Current Sensor Data</p>
                            <div className="grid grid-cols-3 gap-2 text-center p-4 bg-background rounded-md">
                                <div>
                                    <p className="text-xs text-muted-foreground">Humidity</p>
                                    <p className="font-bold text-lg">{mockSensorData.humidity}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Soil Moisture</p>
                                    <p className="font-bold text-lg">{mockSensorData.soilMoisture}%</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Temperature</p>
                                    <p className="font-bold text-lg">{mockSensorData.temperature.toFixed(1)}°C</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
