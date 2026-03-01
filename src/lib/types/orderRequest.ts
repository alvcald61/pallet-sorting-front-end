import { Bulk } from "./bulkType";

export interface CreateOrderRequest {
  bulks: Bulk[];
}

export interface Order {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  enabled: boolean;
  pickupDate: string;
  fromAddress: string;
  toAddress: string;
  projectedDeliveryDate: string;
  realDeliveryDate: string;
  totalVolume: number;
  totalWeight: number;
  orderType: string;
  amount: number;
  solutionImageUrl: string;
  solution: string;
  orderStatus: string;
  packages: Package[];
}

export interface Package {
  type: string;
  volume: number;
  id: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
}
