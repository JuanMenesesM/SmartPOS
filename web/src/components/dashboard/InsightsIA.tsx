import { useInsights } from "@/hooks/useDashboard";
import { Sparkles, AlertTriangle, CheckCircle2, Loader2, BrainCircuit } from "lucide-react";

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={`h-3 rounded-full bg-muted animate-pulse ${className}`} />
  );
}

function getSaludo(): string {
  const hora = new Date().getHours();
  if (hora < 12) return "Buenos días";
  if (hora < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getNombreUsuario(): string {
  try {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr);
      if (usuario && usuario.nombre) {
        return usuario.nombre;
      }
    }
  } catch (e) {
    // Silencioso
  }
  return "Juan"; // Fallback por defecto como solicita el usuario
}

export default function InsightsIA() {
  const { data, isLoading, isError } = useInsights();
  const saludo = getSaludo();
  const nombreUsuario = getNombreUsuario();

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-violet-500/5 p-5 shadow-sm">
      {/* Glow sutil de fondo */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />

      {/* Encabezado */}
      <div className="flex items-center gap-2.5 mb-4 relative">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-violet-500 shadow-sm shadow-primary/30">
          <BrainCircuit className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">SmartPOS Insights</h3>
          <p className="text-[10px] text-muted-foreground">Análisis generado por IA</p>
        </div>
        {!isLoading && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-primary font-medium bg-primary/10 px-2 py-1 rounded-full border border-primary/15">
            <Sparkles className="h-3 w-3" />
            IA
          </span>
        )}
      </div>

      <div className="relative space-y-4">
        {/* Loading skeleton */}
        {isLoading && (
          <div className="space-y-3">
            <SkeletonLine className="w-full" />
            <SkeletonLine className="w-4/5" />
            <SkeletonLine className="w-3/5" />
            <div className="pt-1 space-y-2">
              <SkeletonLine className="w-2/3" />
              <SkeletonLine className="w-3/4" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Analizando datos del negocio…
            </div>
          </div>
        )}

        {/* Error */}
        {isError && !isLoading && (
          <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
            <span className="text-3xl">⚡</span>
            <p className="text-sm font-semibold text-foreground">Análisis no disponible</p>
            <p className="text-xs text-muted-foreground">
              Verifique la clave API de OpenAI para habilitar las sugerencias operacionales.
            </p>
          </div>
        )}

        {/* Contenido */}
        {data && !isLoading && (
          <div className="space-y-4">
            {/* Saludo y Resumen Conversacional */}
            <div className="space-y-1 bg-primary/5 p-3 rounded-lg border border-primary/10">
              <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
                <span>👋</span> {saludo}, {nombreUsuario}.
              </h4>
              <p className="text-xs text-foreground/80 leading-relaxed mt-1">
                {data.resumen}
              </p>
            </div>

            {/* Alertas */}
            {data.alertas.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  ⚠ Alertas
                </p>
                {data.alertas.map((alerta, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/8 border border-amber-500/15"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">{alerta}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Recomendaciones */}
            {data.recomendaciones.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  ✅ Recomendaciones
                </p>
                {data.recomendaciones.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-500/8 border border-emerald-500/15"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-foreground/80 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
