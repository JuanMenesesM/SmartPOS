import { X, Calendar, User, ShieldAlert, Monitor, Globe, FileCode2, ShieldCheck } from "lucide-react";
import { EventoAuditoria } from "@/types/auditoria";
import ModalPortal from "@/components/ui/ModalPortal";

interface Props {
  evento: EventoAuditoria | null;
  onClose: () => void;
}

function accionColor(accion: string) {
  if (accion === "CREAR" || accion === "LOGIN")
    return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (accion === "ELIMINAR" || accion === "LOGOUT")
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
}

export default function AuditoriaDetailSheet({ evento, onClose }: Props) {
  if (!evento) return null;

  return (
    <ModalPortal>
      {/* Overlay idéntico al de Kardex */}
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal centrado */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto max-h-[90vh]">

          {/* Barra de acento superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500 to-blue-500 shrink-0" />

          {/* Cabecera */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight">
                  Detalle del Registro
                </h2>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Auditoría del Sistema
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Cuerpo */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* Grid info principal — 2x2 */}
            <div className="grid grid-cols-2 gap-3">
              {/* Fecha */}
              <div className="bg-muted/30 border border-border/60 rounded-2xl px-4 py-3 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" /> Fecha y Hora
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {new Date(evento.fecha).toLocaleString("es-CO", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Usuario */}
              <div className="bg-muted/30 border border-border/60 rounded-2xl px-4 py-3 space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <User className="h-3 w-3" /> Usuario
                </p>
                <p className="text-sm font-semibold text-foreground leading-snug truncate">
                  {evento.usuarioNombre}
                </p>
              </div>

              {/* Módulo */}
              <div className="bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3 space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <ShieldAlert className="h-3 w-3" /> Módulo
                </p>
                <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {evento.modulo}
                </span>
              </div>

              {/* Acción */}
              <div className={`rounded-2xl px-4 py-3 space-y-1.5 border ${
                evento.accion === "CREAR" || evento.accion === "LOGIN"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : evento.accion === "ELIMINAR" || evento.accion === "LOGOUT"
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              }`}>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Monitor className="h-3 w-3" /> Acción
                </p>
                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${accionColor(evento.accion)}`}>
                  {evento.accion}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Descripción del Suceso
              </p>
              <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl text-sm leading-relaxed text-foreground font-medium">
                {evento.descripcion}
              </div>
            </div>

            {/* Navegador */}
            {evento.navegador && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="h-3 w-3" /> Agente de Usuario
                </p>
                <p className="text-xs text-muted-foreground bg-muted/20 border border-border/60 rounded-xl p-3 font-mono break-all leading-relaxed">
                  {evento.navegador}
                </p>
              </div>
            )}

            {/* JSON Diff */}
            {(evento.datosAnteriores || evento.datosNuevos) && (
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <FileCode2 className="h-4 w-4 text-primary" /> Datos Modificados
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {evento.datosAnteriores && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">Estado Anterior</p>
                      <pre className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl text-[11px] font-mono overflow-x-auto text-rose-700 dark:text-rose-400 max-h-40">
                        {JSON.stringify(evento.datosAnteriores, null, 2)}
                      </pre>
                    </div>
                  )}
                  {evento.datosNuevos && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Estado Nuevo</p>
                      <pre className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-[11px] font-mono overflow-x-auto text-emerald-700 dark:text-emerald-400 max-h-40">
                        {JSON.stringify(evento.datosNuevos, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer con botón con color */}
          <div className="px-6 py-4 border-t border-border/60 flex justify-end bg-muted/10 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Cerrar Detalles
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}