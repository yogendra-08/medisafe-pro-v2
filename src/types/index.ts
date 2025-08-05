export type Document = {
  id: string;
  name: string;
  type: "Lab Report" | "Prescription" | "Invoice" | "Other";
  uploadDate: string;
  summary: string;
  content: string;
};
