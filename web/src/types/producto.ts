export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  stock: number;
  activo: boolean;
}

export interface CreateProductoInput {
  codigo: string;
  nombre: string;
  precioVenta: number;
  stock: number;
  activo?: boolean;
}

export interface UpdateProductoInput {
  codigo?: string;
  nombre?: string;
  precioVenta?: number;
  stock?: number;
  activo?: boolean;
}

export type TipoMovimientoKardex = "COMPRA" | "VENTA" | "AJUSTE" | "MERMA" | "DEVOLUCION" | "ELIMINACION";

export interface MovimientoKardex {
  id: number;
  fecha: string;
  tipo: TipoMovimientoKardex;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  documento?: string;
  proveedor?: string;
  observacion?: string;
  usuario: string;
  productoNombre?: string; // Para mostrar en la tabla general
}

export interface ProductoKardexResponse {
  producto: {
    id: number;
    codigo: string;
    nombre: string;
    stock: number;
  };
  movimientos: MovimientoKardex[];
}

export type FiltroEstado = "todos" | "activo" | "inactivo";
export type FiltroStock = "todos" | "bajo" | "sinstock";

export interface FiltrosProductosState {
  busqueda: string;
  estado: FiltroEstado;
  stock: FiltroStock;
}
