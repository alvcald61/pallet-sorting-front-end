import { CreateOrderRequest } from "@/lib/types/orderRequest";

export const createOrder = async (orderData: CreateOrderRequest) : Promise<any> => {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
};


export const getOrders = async (): Promise<any[]> => {
  const res = await fetch("/api/orders");
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}
