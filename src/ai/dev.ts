import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-document.ts';
import '@/ai/flows/auto-tag-document-type.ts';
import '@/ai/flows/medical-term-explanation.ts';
import '@/ai/flows/explain-document.ts';
import '@/ai/flows/generate-doctor-questions.ts';
