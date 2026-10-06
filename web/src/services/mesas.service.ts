import { Mesa, ItemCarritoMesa, EstadoMesa } from "@/types/venta";

const STORAGE_KEY = "smartpos_mesas_v5";

// ── Helper: Extraer usuario del token JWT almacenado en localStorage ──────────
export function getUsuarioActual(): string {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "—";
    const payload = JSON.parse(atob(token.split(".")[1]));
    const nombre = payload.nombre || payload.sub || payload.email || "";
    const apellido = payload.apellido || "";
    if (!nombre) return "—";
    return apellido ? `${nombre} ${apellido}` : nombre;
  } catch {
    return "—";
  }
}

// ── Mesas iniciales — 5 mesas limpias, 100% LIBRES y DISPONIBLES ────────────────
const MESAS_INICIALES: Mesa[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  numero: i + 1,
  nombre: `Mesa ${i + 1}`,
  estado: "LIBRE" as EstadoMesa,
  carrito: [],
}));

// ── Limpiar todas las claves antiguas de mesas en localStorage ──────────────────
export function limpiarStorageMesasAntiguas() {
  try {
    ["smartpos_mesas", "smartpos_mesas_v1", "smartpos_mesas_v2", "smartpos_mesas_v3", "smartpos_mesas_v4"].forEach(k => {
      localStorage.removeItem(k);
    });
  } catch {}
}

// ── CRUD de mesas en localStorage ─────────────────────────────────────────────
export function getMesas(): Mesa[] {
  try {
    limpiarStorageMesasAntiguas();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MESAS_INICIALES));
      return MESAS_INICIALES;
    }
    const parsed: Mesa[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MESAS_INICIALES));
      return MESAS_INICIALES;
    }
    return parsed;
  } catch {
    return MESAS_INICIALES;
  }
}

export function resetearTodasLasMesas(): Mesa[] {
  limpiarStorageMesasAntiguas();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(MESAS_INICIALES));
  return MESAS_INICIALES;
}

export function getMesaById(id: string): Mesa | undefined {
  return getMesas().find((m) => m.id === id);
}

export function guardarMesas(mesas: Mesa[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mesas));
}

export function eliminarMesa(id: string): Mesa[] {
  const mesas = getMesas().filter((m) => m.id !== id);
  guardarMesas(mesas);
  return mesas;
}

export function actualizarMesa(id: string, partial: Partial<Mesa>): Mesa {
  const mesas = getMesas();
  const index = mesas.findIndex((m) => m.id === id);
  if (index === -1) throw new Error("Mesa no encontrada");

  const actual = mesas[index];
  const updated: Mesa = { ...actual, ...partial };

  mesas[index] = updated;
  guardarMesas(mesas);
  return updated;
}

export function agregarItemMesa(mesaId: string, item: Omit<ItemCarritoMesa, "subtotal">): Mesa {
  const mesa = getMesaById(mesaId);
  if (!mesa) throw new Error("Mesa no encontrada");

  const carrito = [...mesa.carrito];
  const idx = carrito.findIndex((i) => i.productoId === item.productoId);

  if (idx >= 0) {
    const prev = carrito[idx];
    const nuevaCant = prev.cantidad + item.cantidad;
    carrito[idx] = {
      ...prev,
      cantidad: nuevaCant,
      subtotal: nuevaCant * prev.precioUnitario,
    };
  } else {
    carrito.push({ ...item, subtotal: item.cantidad * item.precioUnitario });
  }

  // Asignar mesero del usuario logueado al abrir la mesa por primera vez
  const esPrimeraVez = mesa.estado === "LIBRE";
  return actualizarMesa(mesaId, {
    carrito,
    estado: "EN_CONSUMO",
    aperturaAt: mesa.aperturaAt || new Date().toISOString(),
    mesero: mesa.mesero || (esPrimeraVez ? getUsuarioActual() : mesa.mesero),
  });
}

export function modificarCantidadItemMesa(
  mesaId: string,
  productoId: number,
  delta: number
): Mesa {
  const mesa = getMesaById(mesaId);
  if (!mesa) throw new Error("Mesa no encontrada");

  let carrito = [...mesa.carrito];
  const idx = carrito.findIndex((i) => i.productoId === productoId);

  if (idx >= 0) {
    const item = carrito[idx];
    const nuevaCant = item.cantidad + delta;
    if (nuevaCant <= 0) {
      carrito.splice(idx, 1);
    } else {
      carrito[idx] = {
        ...item,
        cantidad: nuevaCant,
        subtotal: nuevaCant * item.precioUnitario,
      };
    }
  }

  const nuevoEstado: EstadoMesa =
    carrito.length === 0 ? "LIBRE" : mesa.estado;

  return actualizarMesa(mesaId, {
    carrito,
    estado: nuevoEstado,
    aperturaAt: carrito.length === 0 ? undefined : mesa.aperturaAt,
    mesero: carrito.length === 0 ? undefined : mesa.mesero,
  });
}

// ── Marcar que el cliente solicitó la cuenta ──────────────────────────────────
export function solicitarCuenta(mesaId: string): Mesa {
  const mesa = getMesaById(mesaId);
  if (!mesa) throw new Error("Mesa no encontrada");

  return actualizarMesa(mesaId, {
    estado: "POR_COBRAR",
    solicitoCuenta: true,
  });
}

// ── Liberar mesa tras cobro ───────────────────────────────────────────────────
export function vaciarYLiberarMesa(mesaId: string): Mesa {
  return actualizarMesa(mesaId, {
    estado: "LIBRE",
    carrito: [],
    aperturaAt: undefined,
    mesero: undefined,
    personas: undefined,
    solicitoCuenta: false,
  });
}
