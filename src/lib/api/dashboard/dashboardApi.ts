"use server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/dashboard";

async function getTokenFromCookies(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  return token || null;
}

// Obtener estadísticas generales del dashboard
export const getDashboardStats = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return res.json();
};

// Obtener órdenes pendientes
export const getPendingOrders = async (limit: number = 10): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/pending-orders?limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch pending orders");
  return res.json();
};

// Obtener órdenes por cliente
export const getOrdersByClient = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/orders-by-client`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by client");
  return res.json();
};

// Obtener órdenes por chofer
export const getOrdersByDriver = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/orders-by-driver`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by driver");
  return res.json();
};

// Obtener órdenes por camión
export const getOrdersByTruck = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/orders-by-truck`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by truck");
  return res.json();
};

// Obtener órdenes por estado
export const getOrdersByStatus = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/orders-by-status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch orders by status");
  return res.json();
};

// Obtener datos de rendimiento (volumen, peso total, etc)
export const getPerformanceMetrics = async (): Promise<any> => {
  const token = await getTokenFromCookies();
  const res = await fetch(`${API_BASE_URL}/performance-metrics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch performance metrics");
  return res.json();
};
