import { TransportStatus } from "@/lib/types/transportTypes";
import { patch, get } from "../apiClient";

export interface TransportHistoryEntry {
  id: number;
  status: TransportStatus;
  statusDisplayName: string | null;
  timestamp: string;
  locationLatitude: number | null;
  locationLongitude: number | null;
  locationAddress: string | null;
  notes: string | null;
  updatedBy: string;
  photoUrl: string | null;
  signatureUrl: string | null;
}

export interface TransportHistoryResponse {
  data: TransportHistoryEntry[];
  message: string;
  statusCode: number;
  pageInfo: null;
}

export async function quickStatusUpdate(
  id: string,
  status: TransportStatus,
): Promise<void> {
  await patch<void>(`/order/${id}/transport/status/quick?status=${status}`);
}

export async function getTransportHistory(
  orderId: string,
): Promise<TransportHistoryResponse> {
  return get<TransportHistoryResponse>(`/order/${orderId}/transport/history`);
}
