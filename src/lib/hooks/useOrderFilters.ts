import { useState, useMemo } from "react";
import { useDebouncedValue } from "@mantine/hooks";
import { OrderFilters } from "@/lib/types/orderFilterTypes";

const INITIAL_FILTERS: OrderFilters = {
  search: "",
  statuses: [],
  orderType: undefined,
  pickupDateFrom: undefined,
  pickupDateTo: undefined,
};

export function useOrderFilters() {
  const [filters, setFilters] = useState<OrderFilters>(INITIAL_FILTERS);
  const [debouncedSearch] = useDebouncedValue(filters.search, 300);

  const effectiveFilters = useMemo<OrderFilters>(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch]
  );

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.statuses && filters.statuses.length > 0) ||
      filters.orderType ||
      filters.pickupDateFrom ||
      filters.pickupDateTo
  );

  return {
    filters,
    effectiveFilters,
    setFilters,
    resetFilters,
    hasActiveFilters,
  };
}
