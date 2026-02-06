export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
}

export interface PendingOrder {
  id: string;
  orderStatus: string;
  createdAt: string;
  fromAddress: string;
  toAddress: string;
  totalVolume: number;
  totalWeight: number;
}

export interface OrdersByGroupItem {
  id?: string;
  name?: string;
  driverName?: string;
  count?: number;
  total?: number;
}

export interface OrdersByStatusItem {
  status?: string;
  orderStatus?: string;
  count?: number;
  total?: number;
}

export interface PerformanceMetrics {
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  totalDeliveries: number;
}
