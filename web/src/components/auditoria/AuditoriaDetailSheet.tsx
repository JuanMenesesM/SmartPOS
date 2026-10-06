import { X, Calendar, User, ShieldAlert, Monitor, Globe, FileCode2 } from "lucide-react";
import { EventoAuditoria } from "@/types/auditoria";

interface Props {
  evento: EventoAuditoria | null;
  onClose: () => void;
}

export default function AuditoriaDetailSheet({ evento, onClose }: Props) {
  if (!evento) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg h-full bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* ── Cabecera ───────────────────────────────────────────────────────── */}
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Detalle del Registro</h2>
              <p className="text-xs text-muted-foreground">Auditoría del Sistema · ID #{evento.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Cuerpo con Scroll ─────────────────────────────────────────────── */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
          {/* Grid de Información Principal */}
          <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
            <div className="bg-card px-4 py-3 space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Fecha y Hora
              </p>
              <p className="text-xs font-semibold text-foreground">
                {new Date(evento.fecha).toLocaleString("es-CO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div className="bg-card px-4 py-3 space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <User className="h-3.5 w-3.5" /> Usuario
              </p>
              <p className="text-xs font-semibold text-foreground">
                {evento.usuarioNombre} (ID: {evento.usuarioId})
              </p>
            </div>
            <div className="bg-card px-4 py-3 space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5" /> Módulo / Acción
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  {evento.modulo}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  evento.accion === "CREAR" || evento.accion === "LOGIN"
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    : evento.accion === "ELIMINAR" || evento.accion === "LOGOUT"
                    ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                }`}>
                  {evento.accion}
                </span>
              </div>
            </div>
            <div className="bg-card px-4 py-3 space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Monitor className="h-3.5 w-3.5" /> Conexión
              </p>
              <p className="text-xs font-semibold text-foreground font-mono truncate" title={evento.ip}>
                IP: {evento.ip || "Local / Desconocido"}
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Descripción del Suceso</p>
            <div className="p-4 bg-muted/30 border border-border rounded-xl text-xs leading-relaxed text-foreground font-medium">
              {evento.descripcion}
            </div>
          </div>

          {/* Navegador */}
          {evento.navegador && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> Agente de Usuario (Navegador)
              </p>
              <p className="text-xs text-muted-foreground bg-muted/20 border border-border rounded-xl p-3 font-mono break-all leading-tight">
                {evento.navegador}
              </p>
            </div>
          )}

          {/* Comparación de Cambios (JSON Diff) */}
          {(evento.datosAnteriores || evento.datosNuevos) && (
            <div className="space-y-3 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileCode2 className="h-4 w-4 text-primary" /> Datos Modificados
              </p>

              <div className="grid grid-cols-1 gap-4">
                {evento.datosAnteriores && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Estado Anterior</p>
                    <pre className="p-4 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 rounded-xl text-[11px] font-mono overflow-x-auto text-rose-700 dark:text-rose-400 max-h-52 custom-scrollbar">
                      {JSON.stringify(evento.datosAnteriores, null, 2)}
                    </pre>
                  </div>
                )}
                {evento.datosNuevos && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Estado Nuevo</p>
                    <pre className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-mono overflow-x-auto text-emerald-700 dark:text-emerald-400 max-h-52 custom-scrollbar">
                      {JSON.stringify(evento.datosNuevos, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/10 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-muted text-foreground hover:bg-muted/80 border border-border text-xs font-semibold transition-colors"
          >
            Cerrar Detalles
          </button>
        </div>
      </div>
    </div>
  );
}