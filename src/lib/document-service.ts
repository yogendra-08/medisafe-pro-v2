// Document Service for MediSafe Pro
// Handles document operations with Supabase integration

import { supabase, storage } from './supabase';
import type { Document, File } from './supabase';

export class DocumentService {
  // Get all documents for a user
  static async getDocuments(userId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          files (
            id,
            name,
            url,
            size,
            mime_type,
            document_type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents:', error);
      return [];
    }
  }

  // Get all files for a user
  static async getFiles(userId: string): Promise<File[]> {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching files:', error);
      return [];
    }
  }

  // Upload a file to Supabase Storage
  static async uploadFile(file: File, userId: string): Promise<{ url: string; fileId: string } | null> {
    try {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const { data, error } = await storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = storage
        .from('documents')
        .getPublicUrl(fileName);

      // Insert file record into database
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          name: file.name,
          url: urlData.publicUrl,
          size: file.size,
          mime_type: file.type,
          user_id: userId,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      return {
        url: urlData.publicUrl,
        fileId: fileRecord.id,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  // Create a document record
  static async createDocument(data: {
    fileId?: string;
    userId: string;
    summary?: string;
    documentType?: string;
  }): Promise<Document | null> {
    try {
      const { data: document, error } = await supabase
        .from('documents')
        .insert({
          file_id: data.fileId,
          user_id: data.userId,
          summary: data.summary,
          document_type: data.documentType,
        })
        .select()
        .single();

      if (error) throw error;
      return document;
    } catch (error) {
      console.error('Error creating document:', error);
      return null;
    }
  }

  // Delete a document and its associated file
  static async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    try {
      // Get the document to find associated file
      const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('file_id')
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Delete the document
      const { error: deleteDocError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', userId);

      if (deleteDocError) throw deleteDocError;

      // If there's an associated file, delete it too
      if (document?.file_id) {
        const { error: deleteFileError } = await supabase
          .from('files')
          .delete()
          .eq('id', document.file_id)
          .eq('user_id', userId);

        if (deleteFileError) {
          console.error('Error deleting file:', deleteFileError);
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  }

  // Update document metadata
  static async updateDocument(
    documentId: string,
    userId: string,
    updates: { summary?: string; documentType?: string }
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', documentId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  }

  // Get a single document by ID
  static async getDocument(documentId: string, userId: string): Promise<Document | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          files (
            id,
            name,
            url,
            size,
            mime_type,
            document_type
          )
        `)
        .eq('id', documentId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching document:', error);
      return null;
    }
  }
} 