"use server";
import { Order } from "@/lib/types/orderTypes";
import { Wrapper } from "@/lib/utils";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_HOST + "/api/order";

export const createOrder = async (
  orderData: any,
  type: string
): Promise<any> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(`${API_BASE_URL}/solve/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const getOrders = async (): Promise<any[]> => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const getAvailableSlots = async (date: string): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/available-slots?date=${date}`);
  if (!res.ok) throw new Error("Failed to fetch available slots");
  return res.json();
};

export async function getTokenFromLocalStorage(): Promise<string | null> {
  const token = (await cookies()).get("session")?.value;
  return token || null;
  // if (typeof window !== "undefined") {
  //   return localStorage.getItem("jwt");
  // }
  // return null;
}

export const getOrdersByPage = async (
  page: number,
  pageSize: number,
  isAdmin: boolean
): Promise<any> => {
  const token = await getTokenFromLocalStorage();

  const res = await fetch(
    `${API_BASE_URL}?page=${page}&size=${pageSize}&isAdmin=${isAdmin}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};

export const getOrderById = async (id: string): Promise<Wrapper<Order>> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to create order");
  const body = res.json();
  return body;
};

export const getOrderStatus = async (id: string): Promise<any> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(`${API_BASE_URL}/${id}/status`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to create order");
  const body = res.json();
  return body;
};

export const getDistributionImg = async (id: string): Promise<any> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(`${API_BASE_URL}/${id}/image`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // if (!res.ok) throw new Error("Failed to create order");
  if (!res.ok) return null;
  const body = res.text();
  return body;
};

export const continueOrder = async (
  orderId: string,
  amount: number | string | undefined,
  deny: boolean
): Promise<any> => {
  const token = await getTokenFromLocalStorage();
  const res = await fetch(
    `${API_BASE_URL}/${orderId}/continue?amount=${amount ?? ""}&denied=${deny}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
};
