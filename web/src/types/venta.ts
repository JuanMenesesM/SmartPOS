export type EstadoMesa = "LIBRE" | "EN_CONSUMO" | "POR_COBRAR";

export interface ItemCarritoMesa {
  productoId: number;
  codigo: string;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface Mesa {
  id: string;
  numero: number;
  nombre: string; // Ej: "Mesa 1"
  estado: EstadoMesa;
  mesero?: string;
  personas?: number;
  aperturaAt?: string; // ISO string de cuando se abrió
  solicitoCuenta?: boolean;
  carrito: ItemCarritoMesa[];
}

export interface VentaBackend {
  id: number;
  fecha: string;
  total: number;
  activo: boolean;
  usuario: {
    nombre: string;
    apellido?: string;
    correo: string;
  };
  detalles: {
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      id: number;
      codigo: string;
      nombre: string;
    };
  }[];
}

export interface CreateVentaPayload {
  productos: {
    productoId: number;
    cantidad: number;
  }[];
  metodoPago?: "EFECTIVO" | "TRANSFERENCIA";
  referencia?: string;
}
