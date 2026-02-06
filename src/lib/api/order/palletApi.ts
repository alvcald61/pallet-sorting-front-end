import { Pallet } from "@/lib/types/palletType";
import { get } from "../apiClient";

export const getAllPallets = async (): Promise<{ data: Pallet[] }> => {
  return get<{ data: Pallet[] }>("/pallet");
};
