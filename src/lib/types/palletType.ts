export interface Pallet {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  enabled?: boolean;
  width: number;
  height: number;
  length: number;
  weight: number;
  quantity: number;
  tempId: string;
}

export type AddressFormProps = {
  address: string;
  district: string;
  city: string;
  state: string;
};
