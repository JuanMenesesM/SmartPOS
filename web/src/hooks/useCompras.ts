import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCompras,
  getCompraById,
  crearCompra,
  getProveedores,
  crearProveedor,
  CreateProveedorPayload,
  getProductosCatalogo,
  getProductosPorProveedor,
  anularCompra,
  CreateCompraPayload,
} from "@/services/compras.service";

// ── Listar Compras ─────────────────────────────────────────────────────────────
export function useCompras(filtros?: {
  fechaInicio?: string;
  fechaFin?: string;
  proveedorId?: number;
}) {
  return useQuery({
    queryKey: ["compras", filtros],
    queryFn: () => getCompras(filtros),
    staleTime: 30_000,
  });
}

// ── Obtener Compra por ID ──────────────────────────────────────────────────────
export function useCompraById(id: number | null) {
  return useQuery({
    queryKey: ["compra", id],
    queryFn: () => (id ? getCompraById(id) : null),
    enabled: !!id,
    staleTime: 10_000,
  });
}

// ── Crear Compra ───────────────────────────────────────────────────────────────
export function useCrearCompra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCompraPayload) => crearCompra(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ── Anular Compra ──────────────────────────────────────────────────────────────
export function useAnularCompra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => anularCompra(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["kardex"] });
    },
  });
}

// ── Proveedores ────────────────────────────────────────────────────────────────
export function useProveedores() {
  return useQuery({
    queryKey: ["proveedores"],
    queryFn: getProveedores,
    staleTime: 60_000,
  });
}

export function useCrearProveedor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProveedorPayload) => crearProveedor(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
    },
  });
}

// ── Productos para el catálogo de compras ─────────────────────────────────────
export function useProductosCatalogo() {
  return useQuery({
    queryKey: ["productos-catalogo"],
    queryFn: getProductosCatalogo,
    staleTime: 30_000,
  });
}

// ── Productos filtrados por proveedor (vía historial de compras) ────────────
export function useProductosPorProveedor(proveedorId: number | null) {
  return useQuery({
    queryKey: ["productos-proveedor", proveedorId],
    queryFn: () => getProductosPorProveedor(proveedorId!),
    staleTime: 30_000,
    // Solo busca cuando hay proveedor seleccionado
    enabled: proveedorId !== null,
  });
}