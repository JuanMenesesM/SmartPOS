import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductos,
  crearProducto,
  actualizarProducto,
  toggleEstadoProducto,
  getKardexProducto,
} from "@/services/productos.service";
import { CreateProductoInput, UpdateProductoInput } from "@/types/producto";

export function useProductos() {
  return useQuery({
    queryKey: ["productos"],
    queryFn: getProductos,
    staleTime: 30_000,
  });
}

export function useProductoKardex(id: number | null) {
  return useQuery({
    queryKey: ["producto-kardex", id],
    queryFn: () => (id ? getKardexProducto(id) : null),
    enabled: !!id,
    staleTime: 10_000,
  });
}

export function useCrearProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductoInput) => crearProducto(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useActualizarProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateProductoInput }) =>
      actualizarProducto(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useToggleEstadoProducto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleEstadoProducto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
