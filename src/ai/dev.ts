'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-field-health.ts';
import '@/ai/flows/get-treatment-recommendations.ts';
import '@/ai/flows/show-mandi-price.ts';
import '@/ai/flows/generate-crop-image.ts';
import '@/ai/flows/diagnose-plant.ts';
import '@/ai/flows/generate-farming-challenges.ts';
import '@/ai/flows/generate-farming-quiz.ts';
