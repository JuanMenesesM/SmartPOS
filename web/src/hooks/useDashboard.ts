import { useQuery } from "@tanstack/react-query";
import {
  getDashboard,
  getInsights,
  RangoFechas,
} from "@/services/dashboard.service";

export function useDashboard(rango?: RangoFechas) {
  return useQuery({
    // El queryKey incluye el rango para que React Query refetch al cambiar el período
    queryKey: ["dashboard", rango?.periodo, rango?.inicio?.toISOString()],
    queryFn: () => getDashboard(rango),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
}

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
