'use server';

/**
 * @fileOverview A flow for explaining a full medical document.
 *
 * - explainDocument - A function that explains a given medical document.
 * - ExplainDocumentInput - The input type for the explainDocument function.
 * - ExplainDocumentOutput - The return type for the explainDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainDocumentInputSchema = z.object({
  documentText: z.string().describe('The full text of the medical document to explain.'),
});
export type ExplainDocumentInput = z.infer<typeof ExplainDocumentInputSchema>;

const ExplainDocumentOutputSchema = z.object({
  explanation: z.string().describe('A simplified explanation of the entire medical document.'),
});
export type ExplainDocumentOutput = z.infer<typeof ExplainDocumentOutputSchema>;

export async function explainDocument(input: ExplainDocumentInput): Promise<ExplainDocumentOutput> {
  return explainDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainDocumentPrompt',
  input: {schema: ExplainDocumentInputSchema},
  output: {schema: ExplainDocumentOutputSchema},
  prompt: `You are a medical expert with a talent for communication.

  Your task is to explain the following medical document to a patient in simple, clear, and reassuring language. Avoid jargon where possible, and when you must use a medical term, explain it immediately.
  
  Structure your explanation in the following way:
  1.  **Overall Summary:** Start with a brief, high-level summary of what the document is about.
  2.  **Key Findings:** List the most important results or points from the document as bullet points.
  3.  **What This Means for You:** Explain the practical implications of these findings for the patient's health.
  4.  **Next Steps:** Suggest potential next steps or questions the patient might want to ask their doctor.
  
  Document Text:
  {{{documentText}}}`,
});

const explainDocumentFlow = ai.defineFlow(
  {
    name: 'explainDocumentFlow',
    inputSchema: ExplainDocumentInputSchema,
    outputSchema: ExplainDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
