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
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal centrado y más compacto (max-w-md) */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto max-h-[85vh]">

          {/* Barra de acento superior */}
          <div className="h-1 w-full bg-gradient-to-r from-primary via-violet-500 to-blue-500 shrink-0" />

          {/* Cabecera compacta */}
          <div className="relative px-5 py-3.5 flex items-center justify-between border-b border-border/60 bg-muted/20 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-foreground leading-tight">
                  Detalle del Registro
                </h2>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Auditoría del Sistema
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/60"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Cuerpo más compacto */}
          <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">

            {/* Grid info principal — 2x2 ajustado */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Fecha */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-2.5 space-y-0.5 flex flex-col justify-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" /> Fecha y Hora
                </p>
                <p className="font-semibold text-foreground leading-snug">
                  {new Date(evento.fecha).toLocaleString("es-CO", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>

              {/* Usuario */}
              <div className="bg-muted/30 border border-border/60 rounded-xl p-2.5 space-y-0.5 flex flex-col justify-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3 text-primary" /> Usuario
                </p>
                <p className="font-semibold text-foreground leading-snug truncate">
                  {evento.usuarioNombre}
                </p>
              </div>

              {/* Módulo */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-2.5 space-y-1 flex flex-col justify-center">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3 text-primary" /> Módulo
                </p>
                <div>
                  <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                    {evento.modulo}
                  </span>
                </div>
              </div>

              {/* Acción */}
              <div className={`rounded-xl p-2.5 space-y-1 border flex flex-col justify-center ${
                evento.accion === "CREAR" || evento.accion === "LOGIN"
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : evento.accion === "ELIMINAR" || evento.accion === "LOGOUT"
                  ? "bg-rose-500/5 border-rose-500/20"
                  : "bg-amber-500/5 border-amber-500/20"
              }`}>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Monitor className="h-3 w-3 text-primary" /> Acción
                </p>
                <div>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold border ${accionColor(evento.accion)}`}>
                    {evento.accion}
                  </span>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                Descripción del Suceso
              </p>
              <div className="p-3 bg-muted/20 border border-border/60 rounded-xl leading-relaxed text-foreground font-medium">
                {evento.descripcion}
              </div>
            </div>

            {/* Navegador */}
            {evento.navegador && (
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Globe className="h-3 w-3 text-primary" /> Agente de Usuario
                </p>
                <p className="text-[10px] text-muted-foreground bg-muted/20 border border-border/60 rounded-xl p-2.5 font-mono break-all leading-relaxed">
                  {evento.navegador}
                </p>
              </div>
            )}

            {/* JSON Diff */}
            {(evento.datosAnteriores || evento.datosNuevos) && (
              <div className="space-y-2 pt-0.5">
                <p className="font-extrabold uppercase tracking-wider text-foreground flex items-center gap-1.5 text-[11px]">
                  <FileCode2 className="h-3.5 w-3.5 text-primary" /> Datos Modificados
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {evento.datosAnteriores && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider">Estado Anterior</p>
                      <pre className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] font-mono overflow-x-auto text-rose-700 dark:text-rose-400 max-h-32">
                        {JSON.stringify(evento.datosAnteriores, null, 2)}
                      </pre>
                    </div>
                  )}
                  {evento.datosNuevos && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-wider">Estado Nuevo</p>
                      <pre className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] font-mono overflow-x-auto text-emerald-700 dark:text-emerald-400 max-h-32">
                        {JSON.stringify(evento.datosNuevos, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer compacto */}
          <div className="px-5 py-3 border-t border-border/60 flex justify-end bg-muted/20 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Cerrar Detalles
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}