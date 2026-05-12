import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import {
  assignClient,
  getBalance,
  getClientInvoices,
  getInvoiceById,
  getInvoices,
  payInvoice,
  uploadInvoices,
} from "@/lib/api/invoice/invoiceApi";
import { InvoiceFilters } from "@/lib/types/invoiceTypes";

export const useInvoices = (page: number, pageSize: number, filters?: InvoiceFilters) =>
  useQuery({
    queryKey: ["invoices", page, pageSize, filters],
    queryFn: () => getInvoices(page, pageSize, filters),
  });

export const useInvoice = (id: string) =>
  useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });

export const useClientInvoices = (userId: number, page: number, pageSize: number) =>
  useQuery({
    queryKey: ["client-invoices", userId, page, pageSize],
    queryFn: () => getClientInvoices(userId, page, pageSize),
    enabled: !!userId,
  });

export const useInvoiceBalance = (userId: number) =>
  useQuery({
    queryKey: ["invoice-balance", userId],
    queryFn: () => getBalance(userId),
    enabled: !!userId,
  });

export const useUploadInvoices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => uploadInvoices(files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const usePayInvoice = (invoiceId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => payInvoice(invoiceId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", String(invoiceId)] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-balance"] });
      notifications.show({ color: "green", title: "Éxito", message: "Factura marcada como pagada" });
    },
    onError: (error: Error) => {
      notifications.show({ color: "red", title: "Error", message: error.message });
    },
  });
};

export const useAssignClient = (invoiceId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: number) => assignClient(invoiceId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoice", String(invoiceId)] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      notifications.show({ color: "green", title: "Éxito", message: "Cliente asignado" });
    },
  });
};
