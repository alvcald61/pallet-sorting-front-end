"use server";

import { get, post, put, apiDelete } from "@/lib/api/apiClient";

export interface Zone {
  id: number;
  name: string;
  zoneName: string;
  district: string;
  city: string;
  state: string;
  maxDeliveryTime: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PriceCondition {
  priceConditionId: number;
  currency: string;
  minWeight: number;
  maxWeight: number;
  minVolume: number;
  maxVolume: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Price {
  priceId: number;
  zone: Zone;
  priceCondition: PriceCondition;
  price: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

// ─── Prices ───────────────────────────────────────────────────────────────────

export const getPrices = async (): Promise<ApiResponse<Price[]>> => {
  return get<ApiResponse<Price[]>>("price");
};

export const getPriceById = async (id: number): Promise<ApiResponse<Price>> => {
  return get<ApiResponse<Price>>(`price/${id}`);
};

export const createPrice = async (data: {
  zone: { id: number };
  priceCondition: { priceConditionId: number };
  price: number;
}): Promise<ApiResponse<Price>> => {
  return post<ApiResponse<Price>>("price", data);
};

export const updatePrice = async (
  id: number,
  data: {
    zone: { id: number };
    priceCondition: { priceConditionId: number };
    price: number;
  }
): Promise<ApiResponse<Price>> => {
  return put<ApiResponse<Price>>(`price/${id}`, data);
};

export const deletePrice = async (id: number): Promise<ApiResponse<null>> => {
  return apiDelete<ApiResponse<null>>(`price/${id}`);
};

// ─── Zones ────────────────────────────────────────────────────────────────────

export const getZones = async (): Promise<ApiResponse<Zone[]>> => {
  return get<ApiResponse<Zone[]>>("zone");
};

export const getZoneById = async (id: number): Promise<ApiResponse<Zone>> => {
  return get<ApiResponse<Zone>>(`zone/${id}`);
};

export const createZone = async (data: Omit<Zone, "id" | "enabled" | "createdAt" | "updatedAt">): Promise<ApiResponse<Zone>> => {
  return post<ApiResponse<Zone>>("zone", data);
};

export const updateZone = async (
  id: number,
  data: Omit<Zone, "id" | "enabled" | "createdAt" | "updatedAt">
): Promise<ApiResponse<Zone>> => {
  return put<ApiResponse<Zone>>(`zone/${id}`, data);
};

export const deleteZone = async (id: number): Promise<ApiResponse<null>> => {
  return apiDelete<ApiResponse<null>>(`zone/${id}`);
};

// ─── Price Conditions ─────────────────────────────────────────────────────────

export const getPriceConditions = async (): Promise<ApiResponse<PriceCondition[]>> => {
  return get<ApiResponse<PriceCondition[]>>("price-condition");
};

export const getPriceConditionById = async (id: number): Promise<ApiResponse<PriceCondition>> => {
  return get<ApiResponse<PriceCondition>>(`price-condition/${id}`);
};

export const createPriceCondition = async (
  data: Omit<PriceCondition, "priceConditionId" | "enabled" | "createdAt" | "updatedAt">
): Promise<ApiResponse<PriceCondition>> => {
  return post<ApiResponse<PriceCondition>>("price-condition", data);
};

export const updatePriceCondition = async (
  id: number,
  data: Omit<PriceCondition, "priceConditionId" | "enabled" | "createdAt" | "updatedAt">
): Promise<ApiResponse<PriceCondition>> => {
  return put<ApiResponse<PriceCondition>>(`price-condition/${id}`, data);
};

export const deletePriceCondition = async (id: number): Promise<ApiResponse<null>> => {
  return apiDelete<ApiResponse<null>>(`price-condition/${id}`);
};
