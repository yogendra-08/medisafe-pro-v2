'use server';

/**
 * @fileOverview Automatically tags the document type using AI.
 *
 * - autoTagDocumentType - A function that handles the document type tagging process.
 * - AutoTagDocumentTypeInput - The input type for the autoTagDocumentType function.
 * - AutoTagDocumentTypeOutput - The return type for the autoTagDocumentType function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoTagDocumentTypeInputSchema = z.object({
  ocrText: z.string().describe('The OCR extracted text from the document.'),
});
export type AutoTagDocumentTypeInput = z.infer<typeof AutoTagDocumentTypeInputSchema>;

const AutoTagDocumentTypeOutputSchema = z.object({
  documentType: z
    .enum(['Lab Report', 'Prescription', 'Invoice', 'Other'])
    .describe(
      'The automatically detected document type. If the type cannot be determined, return "Other".'
    ),
});
export type AutoTagDocumentTypeOutput = z.infer<typeof AutoTagDocumentTypeOutputSchema>;

export async function autoTagDocumentType(input: AutoTagDocumentTypeInput): Promise<AutoTagDocumentTypeOutput> {
  return autoTagDocumentTypeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoTagDocumentTypePrompt',
  input: {schema: AutoTagDocumentTypeInputSchema},
  output: {schema: AutoTagDocumentTypeOutputSchema},
  prompt: `Analyze the following document text and classify it into one of the following types: Lab Report, Prescription, Invoice, or Other.

  Document Text:
  {{{ocrText}}}
  
  Respond with only the determined type. If you cannot confidently determine the type, classify it as "Other".`,
});

const autoTagDocumentTypeFlow = ai.defineFlow(
  {
    name: 'autoTagDocumentTypeFlow',
    inputSchema: AutoTagDocumentTypeInputSchema,
    outputSchema: AutoTagDocumentTypeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
