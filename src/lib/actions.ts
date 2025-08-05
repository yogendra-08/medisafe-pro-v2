// src/lib/actions.ts
"use server";

import { explainMedicalTerm as explainMedicalTermFlow } from "@/ai/flows/medical-term-explanation";
import { explainDocument as explainDocumentFlow } from "@/ai/flows/explain-document";
import { summarizeDocument } from "@/ai/flows/summarize-document";
import { autoTagDocumentType } from "@/ai/flows/auto-tag-document-type";
import { generateDoctorQuestions as generateDoctorQuestionsFlow } from "@/ai/flows/generate-doctor-questions";
import { z } from "zod";
import type { Document } from "@/types";

const ExplainTermSchema = z.object({
  term: z.string().min(1, "Term cannot be empty."),
});

type ExplainTermState = {
  success: boolean;
  message?: string | null;
  explanation?: string | null;
};

export async function explainMedicalTerm(
  prevState: ExplainTermState | null,
  formData: FormData
): Promise<ExplainTermState> {
  const validatedFields = ExplainTermSchema.safeParse({
    term: formData.get("term"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.term?.join(", "),
    };
  }

  const { term } = validatedFields.data;

  try {
    const result = await explainMedicalTermFlow({ term });
    return {
      success: true,
      explanation: result.explanation,
    };
  } catch (error) {
    console.error("Error explaining medical term:", error);
    return {
      success: false,
      message: "An error occurred while fetching the explanation. Please try again.",
    };
  }
}

const ProcessDocumentSchema = z.object({
  fileName: z.string().min(1),
  fileContent: z.string().min(1), // base64 encoded
});

type ProcessDocumentState = {
    success: boolean;
    message?: string | null;
    document?: Document | null;
};


export async function processDocument(
  prevState: ProcessDocumentState | null,
  formData: { fileName: string; fileContent: string }
): Promise<ProcessDocumentState> {
  const validatedFields = ProcessDocumentSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid file data.",
    };
  }

  const { fileName, fileContent } = validatedFields.data;

  try {
    // Basic text extraction from data URI
    const fileText = Buffer.from(fileContent.split(",")[1], 'base64').toString('utf8');

    if (!fileText) {
        return { success: false, message: "Could not extract text from the file." };
    }

    const [tagResult, summaryResult] = await Promise.all([
        autoTagDocumentType({ ocrText: fileText }),
        summarizeDocument({ documentText: fileText })
    ]);
    
    if (!tagResult.documentType || !summaryResult.summary) {
        throw new Error("AI processing failed to return expected data.");
    }

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: tagResult.documentType as Document["type"], // You might want more robust type checking here
      uploadDate: new Date().toISOString().split("T")[0],
      summary: summaryResult.summary,
      content: fileText,
    };

    return {
        success: true,
        document: newDocument,
    };
  } catch (error) {
    console.error("Error processing document:", error);
    return {
      success: false,
      message: "An error occurred during AI processing. Please try a different file.",
    };
  }
}

const ExplainDocumentSchema = z.object({
  documentContent: z.string().min(1),
});

type ExplainDocumentState = {
    success: boolean;
    message?: string | null;
    explanation?: string | null;
    questions?: string[] | null;
};

export async function explainDocumentAction(
    prevState: ExplainDocumentState | null,
    formData: FormData
): Promise<ExplainDocumentState> {
    const validatedFields = ExplainDocumentSchema.safeParse({
        documentContent: formData.get("documentContent"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid document content.",
        };
    }

    const { documentContent } = validatedFields.data;

    try {
        const [explanationResult, questionsResult] = await Promise.all([
            explainDocumentFlow({ documentText: documentContent }),
            generateDoctorQuestionsFlow({ documentText: documentContent })
        ]);
        
        return {
            ...prevState,
            success: true,
            explanation: explanationResult.explanation,
            questions: questionsResult.questions,
        };
    } catch (error) {
        console.error("Error explaining document:", error);
        return {
            success: false,
            message: "An error occurred while fetching the explanation. Please try again.",
        };
    }
}

export async function generateQuestionsAction(
    prevState: ExplainDocumentState | null,
    formData: FormData
): Promise<ExplainDocumentState> {
    const validatedFields = ExplainDocumentSchema.safeParse({
        documentContent: formData.get("documentContent"),
    });

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid document content.",
        };
    }

    const { documentContent } = validatedFields.data;

    try {
        const result = await generateDoctorQuestionsFlow({ documentText: documentContent });
        return {
            ...prevState,
            success: true,
            questions: result.questions,
        };
    } catch (error) {
        console.error("Error generating questions:", error);
        return {
            success: false,
            message: "An error occurred while generating questions. Please try again.",
        };
    }
}
