import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-field-health.ts';
import '@/ai/flows/get-treatment-recommendations.ts';
import '@/ai/flows/agri-eye-disease-analysis.ts';
