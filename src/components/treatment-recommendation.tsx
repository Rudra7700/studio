'use client';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { getTreatmentPlan } from '@/app/actions';
import type { GetTreatmentRecommendationsInput, GetTreatmentRecommendationsOutput } from '@/ai/flows/get-treatment-recommendations';
import { Loader2, Sparkles, FlaskConical, Leaf, Microscope, Thermometer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

export type TreatmentRecommendationProps = Omit<GetTreatmentRecommendationsInput, 'soilAnalysis' | 'fertilizerHistory'>;

export function TreatmentRecommendation(props: TreatmentRecommendationProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      soilAnalysis: '',
      fertilizerHistory: '',
    },
  });

  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GetTreatmentRecommendationsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = (data: { soilAnalysis?: string; fertilizerHistory?: string }) => {
    setError(null);
    setResult(null);

    startTransition(async () => {
      const input: GetTreatmentRecommendationsInput = {
        ...props,
        soilAnalysis: data.soilAnalysis || undefined,
        fertilizerHistory: data.fertilizerHistory || undefined,
      };

      const response = await getTreatmentPlan(input);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.error || 'An unexpected error occurred.');
      }
    });
  };

  const onSubmit = (data: { soilAnalysis: string; fertilizerHistory: string }) => {
    fetchRecommendations(data);
  };
  
  // Initial fetch without optional data
  useState(() => {
    if(!result){
        fetchRecommendations({});
    }
  });

  return (
    <div className="p-1 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><Microscope/> Initial Assessment</CardTitle>
                </CardHeader>
                 <CardContent className="text-sm space-y-2">
                    <p><strong>Disease Detected:</strong> {props.diseaseDetected}</p>
                    <p><strong>Crop Stage:</strong> {props.cropStage}</p>
                    <p><strong>Weather:</strong> {props.weatherConditions}</p>
                </CardContent>
            </Card>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Card>
                    <CardHeader>
                         <CardTitle className="text-lg flex items-center gap-2"><FlaskConical/> Advanced Data (Optional)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="soil-analysis">Soil Analysis</Label>
                            <Textarea
                                id="soil-analysis"
                                placeholder="e.g., pH: 6.8, N: 120ppm, P: 50ppm, K: 150ppm"
                                {...register('soilAnalysis')}
                            />
                        </div>
                        <div>
                            <Label htmlFor="fertilizer-history">Fertilizer History</Label>
                            <Textarea
                                id="fertilizer-history"
                                placeholder="e.g., Urea 50kg on 15th June, DAP 45kg on 1st July"
                                {...register('fertilizerHistory')}
                            />
                        </div>
                         <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            {isPending ? 'Regenerating...' : 'Regenerate with New Data'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Leaf/> AI-Generated Plan</h3>

          {isPending && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-60 rounded-lg bg-card-foreground/5 p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Generating personalized treatment plan...</p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && (
             <Card className="bg-primary/5">
                <CardContent className="p-6">
                    <div className="prose prose-sm dark:prose-invert max-w-none text-card-foreground whitespace-pre-wrap font-mono text-xs">
                        {result.treatmentRecommendations}
                    </div>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
