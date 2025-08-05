'use server';

/**
 * @fileOverview A flow for explaining medical terms.
 *
 * - explainMedicalTerm - A function that explains a given medical term.
 * - ExplainMedicalTermInput - The input type for the explainMedicalTerm function.
 * - ExplainMedicalTermOutput - The return type for the explainMedicalTerm function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMedicalTermInputSchema = z.object({
  term: z.string().describe('The medical term to explain.'),
  context: z.string().optional().describe('Optional context for the term.'),
});
export type ExplainMedicalTermInput = z.infer<typeof ExplainMedicalTermInputSchema>;

const ExplainMedicalTermOutputSchema = z.object({
  explanation: z.string().describe('A simplified explanation of the medical term.'),
});
export type ExplainMedicalTermOutput = z.infer<typeof ExplainMedicalTermOutputSchema>;

export async function explainMedicalTerm(input: ExplainMedicalTermInput): Promise<ExplainMedicalTermOutput> {
  return explainMedicalTermFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMedicalTermPrompt',
  input: {schema: ExplainMedicalTermInputSchema},
  output: {schema: ExplainMedicalTermOutputSchema},
  prompt: `You are a medical expert. Provide a clear and concise explanation of the medical term: "{{term}}".

  {% if context %}Here is some context: {{context}}.
  {% endif %}
  
  Your explanation should be easy to understand for someone without a medical background.`,
});

const explainMedicalTermFlow = ai.defineFlow(
  {
    name: 'explainMedicalTermFlow',
    inputSchema: ExplainMedicalTermInputSchema,
    outputSchema: ExplainMedicalTermOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
