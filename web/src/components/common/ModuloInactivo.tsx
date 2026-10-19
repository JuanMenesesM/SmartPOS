import { ShieldAlert, ArrowLeft, Sparkles, MessageCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ModuloInactivoProps {
  nombre?: string;
  descripcion?: string;
  moduloKey?: string;
}

export default function ModuloInactivo({
  nombre = "Módulo no contratado",
  descripcion = "Esta funcionalidad no está incluida o se encuentra inactiva en el plan actual de tu empresa.",
}: ModuloInactivoProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center p-4">
      {/* Glow decorativo de fondo */}
      <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/10 blur-[100px]" />
      <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-violet-600/10 blur-[120px] -bottom-10 right-10" />

      {/* Tarjeta principal */}
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-8 sm:p-10 text-center shadow-2xl space-y-6">
        
        {/* Icono con badge */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-violet-500/10 to-transparent border border-primary/20 shadow-lg shadow-primary/10">
              <Lock className="h-9 w-9 text-primary animate-pulse" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* Textos */}
        <div className="space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
            SmartPOS Modular
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">
            {nombre}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            {descripcion}
          </p>
        </div>

        {/* Caja de Contacto / Upgrade */}
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs text-muted-foreground space-y-2 text-left">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
            <span>¿Deseas activar esta característica?</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Ponte en contacto con el administrador o proveedor de tu licencia de SmartPOS para habilitar este módulo inmediatamente sin perder ninguna información.
          </p>
        </div>

        {/* Acciones */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}
