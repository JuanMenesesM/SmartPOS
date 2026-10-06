import api from "@/lib/axios";
import { EventoAuditoria, AuditoriaStats } from "@/types/auditoria";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAuditoriaEventos(): Promise<EventoAuditoria[]> {
  try {
    // Timeout of 5 seconds to prevent infinite loading if backend is down
    const res = await api.get(`/auditoria`, {
      headers: getAuthHeaders(),
      timeout: 5000,
    });
    
    if (Array.isArray(res.data)) {
      return res.data.map((ev: any) => ({
        id: ev.id,
        fecha: ev.fecha,
        usuarioNombre: ev.usuario ? `${ev.usuario.nombre} ${ev.usuario.apellido}`.trim() : "Sistema",
        usuarioId: ev.usuarioId,
        modulo: ev.modulo,
        accion: ev.accion,
        descripcion: ev.descripcion,
        datosAnteriores: ev.datosAnteriores,
        datosNuevos: ev.datosNuevos,
        ip: ev.ip,
        navegador: ev.navegador,
      }));
    }
  } catch (error) {
    console.error("Backend auditoria API error:", error);
  }
  return [];
}

export async function getAuditoriaStats(): Promise<AuditoriaStats> {
  // Mock function for now, if backend doesn't provide stats endpoint
  // We can compute stats locally or request the backend to add it.
  const eventos = await getAuditoriaEventos();
  
  const hoy = new Date().toISOString().split("T")[0];
  const eventosHoy = eventos.filter(e => e.fecha.startsWith(hoy)).length;
  
  const usuariosUnicos = new Set(eventos.map(e => e.usuarioId)).size;
  const productosModificados = eventos.filter(e => e.modulo === "Productos").length;
  const ventasRegistradas = eventos.filter(e => e.modulo === "Ventas" && e.accion === "CREAR").length;

  return {
    eventosHoy,
    usuariosActivos: usuariosUnicos,
    productosModificados,
    ventasRegistradas,
  };
}
