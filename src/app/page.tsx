"use client";

import * as React from "react";
import {
  FileText,
  Filter,
  MoreHorizontal,
  Share2,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AppSidebar from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import type { Document } from "@/types";
import { DateRangePicker } from "@/components/date-range-picker";
import { Badge } from "@/components/ui/badge";
import { UploadDialog } from "@/components/upload-dialog";
import { DocumentService } from "@/lib/document-service";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Annual Blood Panel",
    type: "Lab Report",
    uploadDate: "2023-10-26",
    summary: "Comprehensive blood test results from the annual check-up.",
    content: "Patient: John Doe. Date: 2023-10-25. Hemoglobin: 15.2 g/dL. Glucose: 98 mg/dL. Cholesterol: 190 mg/dL. All values within normal range.",
  },
  {
    id: "doc-2",
    name: "Amoxicillin Prescription",
    type: "Prescription",
    uploadDate: "2023-10-22",
    summary: "10-day course of Amoxicillin for bacterial infection.",
    content: "Dr. Smith prescribes Amoxicillin 500mg. Take one capsule every 12 hours for 10 days. For treatment of sinus infection.",
  },
  {
    id: "doc-3",
    name: "Cardiology Consultation",
    type: "Lab Report",
    uploadDate: "2023-09-15",
    summary: "Follow-up report from Dr. Smith regarding heart palpitations.",
    content: "Patient reports intermittent heart palpitations. EKG shows normal sinus rhythm. Advised to reduce caffeine intake and monitor symptoms.",
  },
  {
    id: "doc-4",
    name: "MRI Scan Results",
    type: "Lab Report",
    uploadDate: "2023-08-01",
    summary: "MRI of the lumbar spine showing a mild disc herniation.",
    content: "MRI of the lumbar spine reveals a mild L4-L5 disc herniation without significant nerve root impingement. Physical therapy recommended.",
  },
  {
    id: "doc-5",
    name: "Dermatologist Visit Invoice",
    type: "Invoice",
    uploadDate: "2023-07-19",
    summary: "Invoice for consultation and minor procedure.",
    content: "Consultation Fee: $150. Cryotherapy for wart removal: $75. Total: $225. Please pay within 30 days.",
  },
];

const HealthStats = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">12</div>
        <p className="text-xs text-muted-foreground">+2 since last month</p>
      </CardContent>
    </Card>
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Lab Reports</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">5</div>
        <p className="text-xs text-muted-foreground">1 new this week</p>
      </CardContent>
    </Card>
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">4</div>
        <p className="text-xs text-muted-foreground">Metformin refilled</p>
      </CardContent>
    </Card>
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Upcoming Reminders</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">3</div>
        <p className="text-xs text-muted-foreground">Dr. Appointment tomorrow</p>
      </CardContent>
    </Card>
  </div>
);

export default function DashboardPage() {
  const [documents, setDocuments] = React.useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [docToDelete, setDocToDelete] = React.useState<Document | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { user } = useAuth();

  const handleDocumentUploaded = (newDocument: Document) => {
    setDocuments((prevDocs) => [newDocument, ...prevDocs]);
  };
  
  // Load documents from Google Sheets
  React.useEffect(() => {
    const loadDocuments = async () => {
      if (user) {
        try {
          const docs = await DocumentService.getDocuments(user.id);
          setDocuments(docs);
        } catch (error) {
          console.error('Error loading documents:', error);
          // Fallback to localStorage
          const storedDocs = JSON.parse(localStorage.getItem("documents") || "[]");
          setDocuments(storedDocs);
        }
      } else {
        // Fallback to localStorage for non-authenticated users
        const storedDocs = JSON.parse(localStorage.getItem("documents") || "[]");
        setDocuments(storedDocs);
      }
      setIsLoading(false);
    };

    loadDocuments();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!docToDelete || !user) return;
    
    try {
      const success = await DocumentService.deleteDocument(docToDelete.id, user.id);
      if (success) {
        const updatedDocs = documents.filter((d) => d.id !== docToDelete.id);
        setDocuments(updatedDocs);
        // Also update localStorage as backup
        localStorage.setItem("documents", JSON.stringify(updatedDocs));
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
    setDocToDelete(null);
  };


  const filteredDocuments = documents
    .filter((doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((doc) => typeFilter === "all" || doc.type === typeFilter);

  return (
    <SidebarProvider>
      <AlertDialog open={!!docToDelete} onOpenChange={(open) => !open && setDocToDelete(null)}>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
            <Header onSearchChange={setSearchTerm} onDocumentUploaded={handleDocumentUploaded} />
            <HealthStats />

            <Card className="glassmorphism">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>My Health Records</CardTitle>
                  <CardDescription>
                    Manage and view your uploaded medical documents.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Filter
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-4" align="end">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Filters</h4>
                            <p className="text-sm text-muted-foreground">
                              Refine your document list.
                            </p>
                          </div>
                          <div className="grid gap-2">
                            <Select onValueChange={setTypeFilter} value={typeFilter}>
                              <SelectTrigger>
                                <SelectValue placeholder="Filter by type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Lab Report">Lab Report</SelectItem>
                                <SelectItem value="Prescription">Prescription</SelectItem>
                                <SelectItem value="Invoice">Invoice</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <DateRangePicker />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <UploadDialog onDocumentUploaded={handleDocumentUploaded}>
                        <Button size="sm" variant="default">Upload Document</Button>
                    </UploadDialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Upload Date
                      </TableHead>
                      <TableHead>
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                           <Link href={`/documents/${doc.id}`} className="font-medium hover:underline">{doc.name}</Link>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {doc.summary}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline">{doc.type}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(doc.uploadDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                aria-haspopup="true"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/documents/${doc.id}`}>
                                  <FileText className="mr-2 h-4 w-4" /> View Details
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Share2 className="mr-2 h-4 w-4" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </DropdownMenuItem>
                               <DropdownMenuSeparator />
                               <DropdownMenuItem onClick={() => setDocToDelete(doc)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </main>
        </div>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the document "{docToDelete?.name}" from your records.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDocToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
