import { useNavigate } from "react-router-dom";
import { X, Calendar, User, ShieldAlert, Monitor, Globe, FileCode2, ShieldCheck, ExternalLink, Activity } from "lucide-react";
import { EventoAuditoria } from "@/types/auditoria";
import ModalPortal from "@/components/ui/ModalPortal";

interface Props {
  evento: EventoAuditoria | null;
  onClose: () => void;
}

function accionMeta(accion: string) {
  switch (accion) {
    case "CREAR":   return { color: "emerald", label: "Crear"    };
    case "LOGIN":   return { color: "emerald", label: "Login"    };
    case "LOGOUT":  return { color: "rose",    label: "Logout"   };
    case "ELIMINAR":return { color: "rose",    label: "Eliminar" };
    case "EDITAR":  return { color: "amber",   label: "Editar"   };
    case "EXPORTAR":return { color: "blue",    label: "Exportar" };
    default:        return { color: "amber",   label: accion     };
  }
}

function heroBg(modulo: string) {
  switch (modulo) {
    case "Ventas":        return "from-sky-500 via-blue-500 to-indigo-500";
    case "Compras":       return "from-emerald-600 via-emerald-500 to-teal-500";
    case "Productos":     return "from-orange-500 via-amber-500 to-yellow-500";
    case "Usuarios":      return "from-sky-600 via-sky-500 to-cyan-500";
    case "Configuracion": return "from-slate-600 via-slate-500 to-zinc-500";
    default:              return "from-primary via-violet-500 to-blue-500";
  }
}

export default function AuditoriaDetailSheet({ evento, onClose }: Props) {
  const navigate = useNavigate();
  if (!evento) return null;

  const { color: aColor, label: aLabel } = accionMeta(evento.accion);
  const heroGradient = heroBg(evento.modulo);

  const accionBadgeClass = {
    emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    rose:    "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
    amber:   "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    blue:    "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  }[aColor] ?? "bg-primary/10 text-primary border-primary/20";

  const fechaFormateada = new Date(evento.fecha).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const horaFormateada = new Date(evento.fecha).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <ModalPortal>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/60 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200 flex flex-col max-h-[92vh]">

          {/* -- Hero header -- */}
          <div className={`relative bg-gradient-to-br ${heroGradient} px-6 pt-6 pb-8 text-white shrink-0 overflow-hidden`}>
            <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10 blur-xl pointer-events-none" />

            {/* Close button with darker hover and cursor-pointer */}
            <button
              onClick={onClose}
              type="button"
              className="absolute right-4 top-4 z-20 h-8 w-8 rounded-xl bg-black/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 hover:bg-black/40 hover:text-white transition-all cursor-pointer active:scale-95 select-none"
              aria-label="Cerrar modal"
            >
              <X className="h-4 w-4 pointer-events-none" />
            </button>

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center mb-3 shadow-xl">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium bg-white/20 border border-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                  {evento.modulo}
                </span>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${accionBadgeClass}`}>
                  {aLabel}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white">Registro de Auditoría</h2>
              <p className="text-sm text-white/75 mt-0.5 font-normal">
                {fechaFormateada} • {horaFormateada}
              </p>
            </div>
          </div>

          {/* Wave separator */}
          <div className={`h-4 bg-gradient-to-br ${heroGradient} shrink-0 relative`}>
            <div className="absolute inset-0 bg-card rounded-t-3xl" />
          </div>

          {/* -- Body -- */}
          <div className="px-5 pb-5 space-y-4 overflow-y-auto flex-1">

            {/* Ficha Técnica del Evento (Diseño elegante y sobrio) */}
            <div className="rounded-2xl border border-border/60 bg-card divide-y divide-border/40 overflow-hidden text-xs">
              {/* Fecha y Hora */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Fecha y hora</span>
                </div>
                <div className="text-right font-medium text-foreground">
                  <span>{fechaFormateada}</span>
                  <span className="text-muted-foreground/60 mx-1.5">•</span>
                  <span className="text-muted-foreground">{horaFormateada}</span>
                </div>
              </div>

              {/* Usuario */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <User className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Usuario operador</span>
                </div>
                <div className="font-medium text-foreground truncate max-w-[200px]">
                  <span>{evento.usuarioNombre}</span>
                </div>
              </div>

              {/* Módulo */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <ShieldAlert className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Módulo afectado</span>
                </div>
                <span className="inline-flex w-fit px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
                  {evento.modulo}
                </span>
              </div>

              {/* Acción */}
              <div className="flex items-center justify-between px-4 py-3 hover:bg-muted/15 transition-colors">
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Monitor className="h-4 w-4 text-muted-foreground/70" />
                  <span className="font-medium text-muted-foreground">Acción ejecutada</span>
                </div>
                <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${accionBadgeClass}`}>
                  {aLabel}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground/70" />
                <span className="text-xs font-semibold text-foreground">Detalle del evento</span>
              </div>
              <div className="p-3.5 bg-card border border-border/60 rounded-2xl leading-relaxed text-foreground/90 font-normal text-xs">
                {evento.descripcion}
              </div>
            </div>

            {/* Navegador */}
            {evento.navegador && (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-xs font-semibold text-foreground">Agente de usuario</span>
                </div>
                <p className="text-[10px] text-muted-foreground bg-muted/20 border border-border/50 rounded-xl p-3 font-mono break-all leading-relaxed">
                  {evento.navegador}
                </p>
              </div>
            )}

            {/* JSON Diff */}
            {(evento.datosAnteriores || evento.datosNuevos) && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-4 w-4 text-muted-foreground/70" />
                  <span className="text-xs font-semibold text-foreground">Datos modificados</span>
                </div>
                {evento.datosAnteriores && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-rose-500 uppercase tracking-wider px-1">Estado anterior</p>
                    <pre className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] font-mono overflow-x-auto text-rose-700 dark:text-rose-400 max-h-32">
                      {JSON.stringify(evento.datosAnteriores, null, 2)}
                    </pre>
                  </div>
                )}
                {evento.datosNuevos && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider px-1">Estado nuevo</p>
                    <pre className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-[10px] font-mono overflow-x-auto text-emerald-700 dark:text-emerald-400 max-h-32">
                      {JSON.stringify(evento.datosNuevos, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* -- Footer -- */}
          <div className="px-5 py-3.5 border-t border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div>
              {evento.modulo === "Ventas" && (
                <button type="button"
                  onClick={() => { onClose(); navigate("/ventas"); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium text-xs border border-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5" /> Ir a Ventas
                </button>
              )}
              {evento.modulo === "Compras" && (
                <button type="button"
                  onClick={() => { onClose(); navigate("/compras"); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-medium text-xs border border-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5" /> Ir a Compras
                </button>
              )}
              {evento.modulo === "Productos" && (
                <button type="button"
                  onClick={() => { onClose(); navigate("/productos"); }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 font-medium text-xs border border-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                  <ExternalLink className="h-3.5 w-3.5" /> Ir a Productos
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              type="button"
              className="px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-medium text-xs shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
