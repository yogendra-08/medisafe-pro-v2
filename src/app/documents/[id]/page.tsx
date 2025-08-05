
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useActionState } from "react";
import {
  FileText,
  Calendar,
  Tag,
  Stethoscope,
  Loader2,
  Share2,
  Download,
  FileSignature,
  HelpCircle,
  MessageSquareQuote,
} from "lucide-react";

import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import type { Document } from "@/types";
import { explainDocumentAction, generateQuestionsAction } from "@/lib/actions";

const initialState = {
  success: false,
  message: null,
  explanation: null,
  questions: null,
};

export default function DocumentDetailPage() {
  const [doc, setDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  
  const [explanationState, explanationFormAction, isExplanationPending] = useActionState(explainDocumentAction, initialState);
  const [questionsState, questionsFormAction, areQuestionsPending] = useActionState(generateQuestionsAction, { ...initialState, explanation: explanationState.explanation });
  
  const isPending = isExplanationPending || areQuestionsPending;

  useEffect(() => {
    const documents: Document[] = JSON.parse(
      localStorage.getItem("documents") || "[]"
    );
    const documentId = typeof params.id === 'string' ? params.id : '';
    const foundDoc = documents.find((d) => d.id === documentId);
    if (foundDoc) {
      setDoc(foundDoc);
    }
  }, [params.id]);

  if (!doc) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Loading document...</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }
  
  // Favor the most recent state that has content.
  const finalState = questionsState.questions ? questionsState : explanationState;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <Header onSearchChange={setSearchTerm} />
          
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card className="glassmorphism">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-6 w-6" />
                                    {doc.name}
                                </CardTitle>
                                <CardDescription>
                                    Review the complete details of your document.
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon"><Share2 className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
                                <Button asChild><Link href={`/certificate/${doc.id}`}><FileSignature className="mr-2"/> View Certificate</Link></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4" />
                                <Badge variant="secondary">{doc.type}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <Separator className="my-4"/>
                        <h3 className="font-semibold text-lg mb-2">Document Content</h3>
                        <pre className="whitespace-pre-wrap font-sans text-sm bg-muted/50 p-4 rounded-md">{doc.content}</pre>
                    </CardContent>
                </Card>
            </div>
            <div>
              <Card className="glassmorphism sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-6 w-6" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>
                    Let AI provide insights on this document.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isPending && (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                       <Loader2 className="h-5 w-5 animate-spin" />
                       <span>Analyzing your document...</span>
                    </div>
                  )}

                  {finalState.success && (finalState.explanation || finalState.questions) && (
                    <div className="space-y-4">
                      {finalState.explanation && (
                         <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><MessageSquareQuote/> Explanation</h3>
                            <div className="prose prose-sm max-w-none text-foreground">
                               <pre className="whitespace-pre-wrap font-sans text-sm">{finalState.explanation}</pre>
                            </div>
                         </div>
                      )}
                      {finalState.questions && (
                        <div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2"><HelpCircle/> Questions for Your Doctor</h3>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                                {finalState.questions.map((q, i) => <li key={i}>{q}</li>)}
                            </ul>
                        </div>
                      )}
                      <Separator />
                       <div className="flex gap-2">
                            <form action={explanationFormAction}>
                                <input type="hidden" name="documentContent" value={doc.content} />
                                <Button type="submit" variant="outline" disabled={isExplanationPending}>
                                    {isExplanationPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <MessageSquareQuote className="mr-2"/>}
                                    Regenerate Explanation
                                </Button>
                            </form>
                            <form action={questionsFormAction}>
                                <input type="hidden" name="documentContent" value={doc.content} />
                                <Button type="submit" variant="outline" disabled={areQuestionsPending}>
                                    {areQuestionsPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <HelpCircle className="mr-2"/>}
                                    Regenerate Questions
                                </Button>
                            </form>
                       </div>
                    </div>
                  )}

                  {!isPending && !finalState.success && (
                     <div className="text-center py-8">
                        <p className="text-sm text-muted-foreground mb-4">Get a simple explanation and suggested questions for your doctor.</p>
                        <div className="flex justify-center gap-2">
                            <form action={explanationFormAction}>
                                <input type="hidden" name="documentContent" value={doc.content} />
                                <Button type="submit">
                                    <Stethoscope className="mr-2"/> Analyze with AI
                                </Button>
                            </form>
                        </div>
                    </div>
                  )}

                  {finalState.message && !finalState.success && (
                    <Alert variant="destructive">
                      <AlertTitle>Action Failed</AlertTitle>
                      <AlertDescription>{finalState.message}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
