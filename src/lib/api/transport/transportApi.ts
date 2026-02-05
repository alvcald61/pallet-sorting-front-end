import { TransportStatus } from "@/lib/types/trnasportTypes";
import { patch } from "../apiClient";

export async function quickStatusUpdate(
  id: string,
  status: TransportStatus,
): Promise<void> {
  await patch<void>(`/order/${id}/transport/status/quick?status=${status}`);
}