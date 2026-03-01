export interface Address {
  address: string;
  district: string;
  city: string;
  state: string;
  addressLink: string;
}

export interface Warehouse {
  warehouseId: number;
  name: string;
  address: string;
  district: string;
  city: string;
  state: string;
  phone: string;
  locationLink: string;
  enabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateWarehouseRequest {
  name: string;
  address: Address;
  phone: string;
}

export interface UpdateWarehouseRequest extends CreateWarehouseRequest {
  id: string;
}
