"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { UploadCloud, File as FileIcon, Loader2 } from "lucide-react";
import React from "react";
import { processDocument } from "@/lib/actions";
import { DocumentService } from "@/lib/document-service";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import type { Document } from "@/types";

interface UploadDialogProps {
  children: React.ReactNode;
  onDocumentUploaded: (doc: Document) => void;
}

export function UploadDialog({ children, onDocumentUploaded }: UploadDialogProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const validateFileSize = (file: File, maxSizeMB: number = 10): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsProcessing(true);

    try {
      // Validate file size
      if (!validateFileSize(file, 10)) {
        throw new Error("File size must be less than 10MB");
      }

      // Upload file to Supabase Storage
      const uploadResult = await DocumentService.uploadFile(file, user.id);
      
      if (!uploadResult) {
        throw new Error("Failed to upload file to storage");
      }

      // Process document with AI
      const result = await processDocument(null, {
        fileName: file.name,
        fileContent: `data:${file.type};base64,${await fileToBase64(file)}`,
      });

      if (result.success && result.document) {
        // Create document record in database
        const document = await DocumentService.createDocument({
          fileId: uploadResult.fileId,
          userId: user.id,
          summary: result.document.summary,
          documentType: result.document.type,
        });

        if (document) {
          // Create document object for UI
          const newDoc: Document = {
            ...result.document,
            id: document.id,
          };

          onDocumentUploaded(newDoc);
          toast({
            title: "Upload Successful",
            description: `${file.name} has been processed and uploaded to your secure storage.`,
          });
          setFile(null);
          setIsOpen(false);
        } else {
          throw new Error("Failed to create document record");
        }
      } else {
        throw new Error(result.message || "An unknown error occurred during processing.");
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          (error as Error).message ||
          "There was an error processing your document.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  React.useEffect(() => {
    if (!isOpen) {
      setFile(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Add new medical records to your profile. Supports PDF, images, and text files (max 10MB).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {file ? (
            <div className="flex items-center space-x-4 p-4 rounded-md border bg-muted/50">
              <FileIcon className="h-6 w-6" />
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                disabled={isProcessing}
              >
                <UploadCloud className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-8 h-8 mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag
                    and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, JPG, PNG, TXT, MD (max 10MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.txt,.md,.doc,.docx"
                  disabled={isProcessing}
                />
              </label>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} variant="outline" disabled={isProcessing}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Upload & Process"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
