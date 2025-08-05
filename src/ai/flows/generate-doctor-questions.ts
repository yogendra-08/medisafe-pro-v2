'use server';

/**
 * @fileOverview A flow for generating questions for a doctor based on a medical document.
 *
 * - generateDoctorQuestions - A function that generates questions.
 * - GenerateDoctorQuestionsInput - The input type for the function.
 * - GenerateDoctorQuestionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDoctorQuestionsInputSchema = z.object({
  documentText: z.string().describe('The full text of the medical document.'),
});
export type GenerateDoctorQuestionsInput = z.infer<typeof GenerateDoctorQuestionsInputSchema>;

const GenerateDoctorQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('An array of questions for the user to ask their doctor.'),
});
export type GenerateDoctorQuestionsOutput = z.infer<typeof GenerateDoctorQuestionsOutputSchema>;

export async function generateDoctorQuestions(input: GenerateDoctorQuestionsInput): Promise<GenerateDoctorQuestionsOutput> {
  return generateDoctorQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDoctorQuestionsPrompt',
  input: {schema: GenerateDoctorQuestionsInputSchema},
  output: {schema: GenerateDoctorQuestionsOutputSchema},
  prompt: `You are a helpful medical assistant. Your role is to empower patients by helping them prepare for their doctor's appointments.

  Analyze the following medical document. Based on its content, identify key areas of concern, uncertainty, or importance.
  
  Generate a list of 3-5 clear, concise, and relevant questions that the patient should consider asking their doctor for clarification or to better understand their health.
  
  Focus on questions that:
  - Seek clarification on results or diagnoses.
  - Inquire about treatment options or lifestyle changes.
  - Ask about next steps or long-term prognosis.
  
  Document Text:
  {{{documentText}}}
  `,
});

const generateDoctorQuestionsFlow = ai.defineFlow(
  {
    name: 'generateDoctorQuestionsFlow',
    inputSchema: GenerateDoctorQuestionsInputSchema,
    outputSchema: GenerateDoctorQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
