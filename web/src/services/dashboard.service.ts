import api from "@/lib/axios";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

// ── Tipos de rango de fechas ────────────────────────────────────────────────────

export type RangoPeriodo = "hoy" | "semana" | "mes" | "anio" | "personalizado";

export interface RangoFechas {
  periodo: RangoPeriodo;
  inicio: Date;
  fin: Date;
}

/** Calcula el inicio y fin para cada período predefinido */
export function calcularRango(periodo: RangoPeriodo): RangoFechas {
  const ahora = new Date();
  let fin = new Date(ahora);
  fin.setHours(23, 59, 59, 999);

  let inicio: Date;

  switch (periodo) {
    case "hoy": {
      inicio = new Date(ahora);
      inicio.setHours(0, 0, 0, 0);
      break;
    }
    case "semana": {
      inicio = new Date(ahora);
      const diaSemana = ahora.getDay(); // 0=Dom, 1=Lun…6=Sáb
      // Días hacia atrás hasta el lunes
      const diasHastaLunes = diaSemana === 0 ? 6 : diaSemana - 1;
      // Días hacia adelante hasta el domingo
      const diasHastaDomingo = diaSemana === 0 ? 0 : 7 - diaSemana;
      inicio.setDate(ahora.getDate() - diasHastaLunes);
      inicio.setHours(0, 0, 0, 0);
      // fin = domingo de la semana (23:59:59)
      fin = new Date(ahora);
      fin.setDate(ahora.getDate() + diasHastaDomingo);
      fin.setHours(23, 59, 59, 999);
      break;
    }
    case "mes": {
      inicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1, 0, 0, 0, 0);
      break;
    }
    case "anio": {
      inicio = new Date(ahora.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;
    }
    case "personalizado":
      // El rango personalizado se construye externamente; esto devuelve el día de hoy como base
      inicio = new Date(ahora);
      inicio.setHours(0, 0, 0, 0);
      break;
  }

  return { periodo, inicio, fin };
}

// ── Interfaces de datos ─────────────────────────────────────────────────────────

export interface DashboardData {
  kpis: {
    ventasHoy: number;
    ventasMes: number;
    facturasHoy: number;
    stockBajo: number;
  };
  ventasPorDia: { fecha: string; total: number }[];
  productosMasVendidos: { id: number; producto: string; cantidad: number }[];
  stockCritico: { id: number; codigo: string; nombre: string; stock: number }[];
  actividadReciente: { fecha: string; usuario: string; descripcion: string }[];
}

export interface InsightsData {
  resumen: string;
  alertas: string[];
  recomendaciones: string[];
}

// ── Llamadas a la API ───────────────────────────────────────────────────────────

export async function getDashboard(rango?: RangoFechas): Promise<DashboardData> {
  const params: Record<string, string> = {};

  if (rango) {
    params.inicio = rango.inicio.toISOString();
    params.fin    = rango.fin.toISOString();
  }

  const { data } = await api.get(`/dashboard`, {
    headers: getAuthHeaders(),
    params,
  });
  return data;
}

export async function getInsights(): Promise<InsightsData> {
  const { data } = await api.get(`/openai/test`, {
    headers: getAuthHeaders(),
  });
  return data;
}
