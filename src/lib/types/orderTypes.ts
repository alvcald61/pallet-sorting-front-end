import { OrderStatus } from "../utils/enums";

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
  orderStatus: OrderStatus;
  packages: Package[];
  truck: Truck;
  driver: Driver;
  gpsLink: string;
  fromAddressLink: string;
  toAddressLink: string;
  documents: Document[];
  documentPending: boolean;
}

export interface Document {
  documentId: number;
  documentName: string;
  link: string;
  required: boolean;
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

export interface Truck {
  id: string;
  width: number;
  length: number;
  height: number;
  status: string;
  licensePlate: string;
  volume: number;
  weight: number;
  area: number;
  enabled: boolean;
  multiplayer: number;
  driverId: number;
  driverName: string;
}

export interface Driver {
  driverId: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  enabled: boolean;
  dni: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}
