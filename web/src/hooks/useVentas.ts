import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVentas, crearVentaBackend, getVentaById } from "@/services/ventas.service";
import { CreateVentaPayload } from "@/types/venta";

export function useVentas() {
  return useQuery({
    queryKey: ["ventas"],
    queryFn: getVentas,
    staleTime: 15_000,
  });
}

export function useVentaById(id: number | null) {
  return useQuery({
    queryKey: ["venta", id],
    queryFn: () => (id ? getVentaById(id) : null),
    enabled: !!id,
  });
}

export function useCrearVenta() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVentaPayload) => crearVentaBackend(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
