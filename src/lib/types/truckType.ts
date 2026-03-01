export type TruckStatus = "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "INACTIVE";

export interface Truck {
  id: string;
  width: number;
  length: number;
  height: number;
  status: TruckStatus;
  licensePlate: string;
  volume: number;
  weight: number;
  area: number;
  enabled: boolean;
  multiplayer: number;
  driverId?: string;
}

export interface CreateTruckRequest {
  width: number;
  length: number;
  height: number;
  status: TruckStatus;
  licensePlate: string;
  volume: number;
  weight: number;
  area: number;
  enabled: boolean;
  driverId?: string;
}

export interface UpdateTruckRequest extends CreateTruckRequest {
  id: string;
}
