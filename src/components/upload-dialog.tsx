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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { UploadCloud, File as FileIcon, Loader2, X } from "lucide-react";
import React from "react";
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
  const [description, setDescription] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [documentType, setDocumentType] = React.useState("");
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

      // Create document record in database with manual inputs
      const document = await DocumentService.createDocument({
        fileId: uploadResult.fileId,
        userId: user.id,
        summary: description || undefined,
        documentType: documentType || undefined,
        tags: tags ? tags.split(",").map(tag => tag.trim()) : undefined,
      });

      if (document) {
        // The document service now returns the properly mapped Document object
        onDocumentUploaded(document);
        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded to your secure storage.`,
        });
        
        // Reset form
        setFile(null);
        setDescription("");
        setTags("");
        setDocumentType("");
        setIsOpen(false);
      } else {
        throw new Error("Failed to create document record");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          (error as Error).message ||
          "There was an error uploading your document.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setFile(null);
    setDescription("");
    setTags("");
    setDocumentType("");
  };
  
  React.useEffect(() => {
    if (!isOpen) {
      setFile(null);
      setDescription("");
      setTags("");
      setDocumentType("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
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
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted"
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

          {file && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-type">Document Type (Optional)</Label>
                <Input
                  id="document-type"
                  placeholder="e.g., Lab Report, Prescription, Medical Record"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={isProcessing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description or notes about this document..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isProcessing}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., blood test, cardiology, 2024 (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isProcessing}
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline" disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Document"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
