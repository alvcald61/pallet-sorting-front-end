export enum InvoiceStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export enum UploadStatus {
  SUCCESS = "SUCCESS",
  WARNING = "WARNING",
  ERROR = "ERROR",
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  clientRuc: string;
  clientName: string;
  currency: string;
  subtotal: number;
  igv: number;
  total: number;
  status: InvoiceStatus;
  userId: number | null;
  clientBusinessName: string | null;
  paidAt: string | null;
  evidenceFiles?: PaymentEvidence[];
}

export interface PaymentEvidence {
  id: number;
  fileUrl: string;
  fileName: string;
  uploadedBy: string;
  createdAt: string;
}

export interface InvoiceUploadResult {
  fileName: string;
  status: UploadStatus;
  invoiceNumber: string | null;
  error: string | null;
  message: string | null;
}

export interface InvoiceBalance {
  totalBilled: number;
  totalPaid: number;
  pending: number;
}

export interface InvoiceFilters {
  status?: InvoiceStatus;
  userId?: number;
  dateFrom?: string;
  dateTo?: string;
}
