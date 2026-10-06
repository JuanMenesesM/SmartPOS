import { useState } from "react";
import { LayoutGrid, History, Sparkles } from "lucide-react";
import EnVivoTab from "./EnVivoTab";
import HistorialTab from "./HistorialTab";

export default function VentasPage() {
  const [tab, setTab] = useState<"ENVIVO" | "HISTORIAL">("ENVIVO");

  return (
    <div className="space-y-6">
      {/* Encabezado Principal Ventas */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />

          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ventas
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Sparkles className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Atención en vivo por mesas, terminal POS e historial de facturación.
              </span>
            </div>
          </div>
        </div>

        {/* Pestañas [En Vivo | Historial] */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border shadow-sm">
          <button
            onClick={() => setTab("ENVIVO")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
              transition-all duration-150 select-none
              ${tab === "ENVIVO"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }
            `}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>En Vivo</span>
          </button>

          <button
            onClick={() => setTab("HISTORIAL")}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
              transition-all duration-150 select-none
              ${tab === "HISTORIAL"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }
            `}
          >
            <History className="h-3.5 w-3.5" />
            <span>Historial</span>
          </button>
        </div>
      </div>

      {/* Contenido según pestaña */}
      {tab === "ENVIVO" ? <EnVivoTab /> : <HistorialTab />}
    </div>
  );
}
