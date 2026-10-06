export type EstadoCompra = "PENDIENTE" | "RECIBIDA" | "CANCELADA";

export interface ItemCompraInput {
  productoId: string;
  cantidad: number;
  costoUnitario: number;
}

export interface CompraItem extends ItemCompraInput {
  id: string;
  productoNombre: string;
  productoCodigo: string;
  subtotal: number;
}

export interface Compra {
  id: string;
  numero: string; // Ej: CP-00015
  proveedorId: string;
  proveedorNombre: string;
  factura: string;
  fecha: string;
  observaciones?: string;
  total: number;
  estado: EstadoCompra;
  items: CompraItem[];
}

export interface CreateCompraInput {
  proveedorId: string;
  factura: string;
  fecha: string;
  observaciones?: string;
  items: ItemCompraInput[];
}

export type FiltroEstadoCompra = "todos" | "pendiente" | "recibida" | "cancelada";