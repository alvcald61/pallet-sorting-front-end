import { useState, useEffect } from "react";
import { getAllPallets } from "@/lib/api/order/palletApi";
import { Pallet } from "@/lib/types/palletType";

/**
 * Custom hook to fetch and manage pallets
 * Shared between bulk and pallet order pages
 */
export const usePallets = () => {
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPallets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllPallets();
        setPallets(response?.data || []);
      } catch (err) {
        setError(err as Error);
        console.error("Error fetching pallets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPallets();
  }, []);

  return { pallets, loading, error };
};
