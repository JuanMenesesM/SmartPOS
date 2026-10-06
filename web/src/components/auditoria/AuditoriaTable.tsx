import { FileText } from "lucide-react";
import { EventoAuditoria } from "@/types/auditoria";
import { AccionBadge, ModuloBadge } from "./AuditoriaBadges";

interface Props {
  eventos: EventoAuditoria[];
  onRowClick: (evento: EventoAuditoria) => void;
}

export default function AuditoriaTable({ eventos, onRowClick }: Props) {
  // ── Empty State ───────────────────────────────────────────────────────────────
  if (eventos.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border py-10 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[240px]">
        <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center text-muted-foreground">
          <FileText className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-foreground">No existen registros de auditoría</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Las acciones realizadas por los usuarios aparecerán aquí automáticamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm">
      <table className="w-full text-xs text-left">
        <thead className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/30 border-b border-border/60">
          <tr>
            <th className="px-3 py-3 font-semibold text-center">Fecha y Hora</th>
            <th className="px-3 py-3 font-semibold text-center">Usuario</th>
            <th className="px-3 py-3 font-semibold text-center">Módulo</th>
            <th className="px-3 py-3 font-semibold text-center">Acción</th>
            <th className="px-3 py-3 font-semibold text-center">Descripción</th>
            <th className="px-3 py-3 text-center w-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {eventos.map((ev) => (
            <tr
              key={ev.id}
              className="hover:bg-muted/40 cursor-pointer transition-colors group"
              onClick={() => onRowClick(ev)}
            >
              <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap font-medium text-center">
                {new Date(ev.fecha).toLocaleString("es-CO", {
                  day: "2-digit", month: "short",
                  hour: "2-digit", minute: "2-digit",
                })}
              </td>
              <td className="px-3 py-2.5 font-semibold text-foreground whitespace-nowrap text-center">
                {ev.usuarioNombre}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-center">
                <ModuloBadge modulo={ev.modulo} />
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-center">
                <AccionBadge accion={ev.accion} />
              </td>
              <td className="px-3 py-2.5 text-muted-foreground max-w-[280px] truncate mx-auto text-center">
                {ev.descripcion}
              </td>
              <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                {/* Reserved for actions if needed */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
