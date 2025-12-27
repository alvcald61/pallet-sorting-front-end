export interface Pallet {
  id: string;
  tempId: string;
  width: number;
  length: number;
  weight: number;
  quantity: number;
  height: number;
  enabled: boolean;
  updatedAt?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreatePalletRequest {
  width: number;
  length: number;
  height: number;
  enabled: boolean;
}

export interface UpdatePalletRequest extends CreatePalletRequest {
  id: string;
}

export type AddressFormProps = {
  address: string;
  district: string;
  city: string;
  state: string;
  warehouseId?: string;
};
