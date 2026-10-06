import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { FiltroEstado, FiltroStock } from "@/types/producto";

interface Props {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  estado: FiltroEstado;
  onEstadoChange: (val: FiltroEstado) => void;
  stock: FiltroStock;
  onStockChange: (val: FiltroStock) => void;
}

const OPCIONES_ESTADO: { value: FiltroEstado; label: string; dot?: string }[] = [
  { value: "todos", label: "Estado: Todos" },
  { value: "activo", label: "Activo", dot: "bg-emerald-500" },
  { value: "inactivo", label: "Inactivo", dot: "bg-slate-400" },
];

const OPCIONES_STOCK: { value: FiltroStock; label: string; dot?: string }[] = [
  { value: "todos", label: "Inventario: Todos" },
  { value: "bajo", label: "Stock bajo (1-5)", dot: "bg-amber-500" },
  { value: "sinstock", label: "Sin stock (0)", dot: "bg-red-500" },
];

export default function ProductoFilters({
  busqueda,
  onBusquedaChange,
  estado,
  onEstadoChange,
  stock,
  onStockChange,
}: Props) {
  const [openEstado, setOpenEstado] = useState(false);
  const [openStock, setOpenStock] = useState(false);

  const refEstado = useRef<HTMLDivElement>(null);
  const refStock = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (refEstado.current && !refEstado.current.contains(e.target as Node)) {
        setOpenEstado(false);
      }
      if (refStock.current && !refStock.current.contains(e.target as Node)) {
        setOpenStock(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const estadoActivo = OPCIONES_ESTADO.find((o) => o.value === estado) ?? OPCIONES_ESTADO[0];
  const stockActivo = OPCIONES_STOCK.find((o) => o.value === stock) ?? OPCIONES_STOCK[0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full bg-card p-2.5 rounded-2xl border border-border shadow-sm">
      {/* Buscador extendido (~20px más ancho / flex dominante) */}
      <div className="relative flex-[1.8] w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Buscar producto..."
          className="
            w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-muted/40 border border-transparent
            text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20
            transition-all duration-200
          "
        />
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 flex-1 sm:flex-none justify-end">
        {/* Dropdown Estado */}
        <div ref={refEstado} className="relative flex-1 sm:flex-none">
          <button
            onClick={() => {
              setOpenEstado((prev) => !prev);
              setOpenStock(false);
            }}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none
              ${openEstado || estado !== "todos"
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
            `}
          >
            <div className="flex items-center gap-2">
              {estadoActivo.dot && (
                <span className={`h-2 w-2 rounded-full ${estadoActivo.dot}`} />
              )}
              <span>{estadoActivo.label}</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                openEstado ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {openEstado && (
            <div className="absolute right-0 top-full mt-2 w-48 z-50 bg-card border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {OPCIONES_ESTADO.map((op) => {
                const isSelected = op.value === estado;
                return (
                  <button
                    key={op.value}
                    onClick={() => {
                      onEstadoChange(op.value);
                      setOpenEstado(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                      transition-colors duration-150
                      ${isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-accent text-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {op.dot && (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? "bg-primary-foreground" : op.dot
                          }`}
                        />
                      )}
                      <span>{op.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dropdown Stock */}
        <div ref={refStock} className="relative flex-1 sm:flex-none">
          <button
            onClick={() => {
              setOpenStock((prev) => !prev);
              setOpenEstado(false);
            }}
            className={`
              w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold
              transition-all duration-200 select-none
              ${openStock || stock !== "todos"
                ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
                : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
              }
            `}
          >
            <div className="flex items-center gap-2">
              {stockActivo.dot && (
                <span className={`h-2 w-2 rounded-full ${stockActivo.dot}`} />
              )}
              <span>{stockActivo.label}</span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
                openStock ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>

          {openStock && (
            <div className="absolute right-0 top-full mt-2 w-52 z-50 bg-card border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {OPCIONES_STOCK.map((op) => {
                const isSelected = op.value === stock;
                return (
                  <button
                    key={op.value}
                    onClick={() => {
                      onStockChange(op.value);
                      setOpenStock(false);
                    }}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                      transition-colors duration-150
                      ${isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-accent text-foreground"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      {op.dot && (
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isSelected ? "bg-primary-foreground" : op.dot
                          }`}
                        />
                      )}
                      <span>{op.label}</span>
                    </div>
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
