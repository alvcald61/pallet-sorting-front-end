import { get, patch, postFormData } from "../apiClient";
import { Invoice, InvoiceBalance, InvoiceFilters, InvoiceUploadResult } from "@/lib/types/invoiceTypes";
import { Wrapper } from "@/lib/utils";

interface PaginatedInvoices {
  data: Invoice[];
  pageInfo: { totalElements: number; totalPages: number };
}

export const uploadInvoices = async (files: File[]): Promise<InvoiceUploadResult[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return postFormData<InvoiceUploadResult[]>("/invoice/upload", formData);
};

export const getInvoices = async (
  page: number,
  pageSize: number,
  filters?: InvoiceFilters
): Promise<PaginatedInvoices> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(pageSize));
  if (filters?.status) params.append("status", filters.status);
  if (filters?.clientId) params.append("clientId", String(filters.clientId));
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);
  return get<PaginatedInvoices>(`/invoice?${params.toString()}`);
};

export const getInvoiceById = async (id: string): Promise<Wrapper<Invoice>> => {
  return get<Wrapper<Invoice>>(`/invoice/${id}`);
};

export const assignClient = async (invoiceId: number, clientId: number): Promise<void> => {
  return patch<void>(`/invoice/${invoiceId}/client?clientId=${clientId}`);
};

export const payInvoice = async (invoiceId: number, files: File[]): Promise<void> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  return postFormData<void>(`/invoice/${invoiceId}/pay`, formData);
};

export const getBalance = async (clientId: number): Promise<Wrapper<InvoiceBalance>> => {
  return get<Wrapper<InvoiceBalance>>(`/invoice/balance/${clientId}`);
};

export const getClientInvoices = async (
  clientId: number,
  page: number,
  pageSize: number
): Promise<PaginatedInvoices> => {
  const params = new URLSearchParams();
  params.append("page", String(page));
  params.append("size", String(pageSize));
  return get<PaginatedInvoices>(`/invoice/client/${clientId}?${params.toString()}`);
};
