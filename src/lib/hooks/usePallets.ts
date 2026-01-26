import { useQuery } from "@tanstack/react-query";
import { getAllPallets } from "@/lib/api/order/palletApi";

/**
 * Custom hook to fetch and manage pallets with React Query
 * Shared between bulk and pallet order pages
 */
export const usePallets = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["order-pallets"], // Different key to avoid collision with pallet CRUD page
    queryFn: getAllPallets,
    staleTime: 10 * 60 * 1000, // 10 minutes - pallets don't change often
  });

  return {
    pallets: data?.data || [],
    loading: isLoading,
    error,
    refetch,
  };
};
