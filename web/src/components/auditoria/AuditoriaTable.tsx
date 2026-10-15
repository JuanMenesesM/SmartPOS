import { FileText, Eye } from "lucide-react";
import { EventoAuditoria } from "@/types/auditoria";
import { ModuloBadge } from "./AuditoriaBadges";

interface Props {
  eventos: EventoAuditoria[];
  onRowClick: (evento: EventoAuditoria) => void;
}

export default function AuditoriaTable({ eventos, onRowClick }: Props) {
  // ── Empty State ───────────────────────────────────────────────────────────────
  if (eventos.length === 0) {
    return (
      <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 py-12 px-6 text-center flex flex-col items-center justify-center space-y-3 min-h-[260px] shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center ring-8 ring-primary/5">
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
    <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/80 shadow-lg shadow-black/[0.03] dark:shadow-black/20 overflow-hidden ring-1 ring-border/40">
      <div className="h-1 w-full bg-gradient-to-r from-primary/30 via-primary to-primary/30 shrink-0" />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-muted/70 dark:bg-muted/40 backdrop-blur-md border-b border-border/80 text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4 font-extrabold text-center">Fecha y Hora</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Usuario</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Módulo</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Descripción</th>
              <th className="py-3.5 px-4 font-extrabold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {eventos.map((ev) => (
              <tr
                key={ev.id}
                className="even:bg-muted/[0.22] dark:even:bg-muted/[0.12] hover:bg-primary/[0.08] dark:hover:bg-primary/[0.15] cursor-pointer transition-colors duration-150 group"
                onClick={() => onRowClick(ev)}
              >
                <td className="py-3.5 px-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-xs">
                      {new Date(ev.fecha).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[11px] text-muted-foreground/80 font-mono mt-0.5">
                      {new Date(ev.fecha).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/25 shrink-0 shadow-2xs">
                      {ev.usuarioNombre.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground text-xs truncate max-w-[140px] group-hover:text-primary transition-colors">
                      {ev.usuarioNombre}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center">
                    <ModuloBadge modulo={ev.modulo} />
                  </div>
                </td>
                <td className="py-3.5 px-4 text-foreground/85 group-hover:text-foreground max-w-[360px] truncate text-center font-medium transition-colors">
                  {ev.descripcion}
                </td>
                <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onRowClick(ev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground border border-primary/20 hover:border-primary shadow-2xs hover:shadow-md hover:shadow-primary/20 transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Ver</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
