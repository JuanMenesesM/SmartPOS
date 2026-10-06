import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, CheckCircle2, Activity, Receipt, Trash2, X } from "lucide-react";
import { Mesa, EstadoMesa } from "@/types/venta";
import { getMesas, guardarMesas, eliminarMesa } from "@/services/mesas.service";
import MesaCard, { AgregarMesaCard } from "@/components/ventas/MesaCard";

export default function EnVivoTab() {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState<Mesa[]>(getMesas);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoMesa | "TODAS">("TODAS");
  const [mesaAEliminar, setMesaAEliminar] = useState<Mesa | null>(null);

  const handleMesaClick = (mesa: Mesa) => {
    navigate(`/ventas/mesa/${mesa.id}`);
  };

  const handleAgregarMesa = () => {
    const num = mesas.length + 1;
    const nuevaMesa: Mesa = {
      id: String(num),
      numero: num,
      nombre: `Venta ${num.toString().padStart(2, '0')}`,
      estado: "LIBRE",
      carrito: [],
    };
    const actualizadas = [...mesas, nuevaMesa];
    setMesas(actualizadas);
    guardarMesas(actualizadas);
  };

  const handleEliminarMesa = (id: string) => {
    const m = mesas.find((x) => x.id === id);
    if (m) setMesaAEliminar(m);
  };

  const confirmarEliminarMesa = () => {
    if (!mesaAEliminar) return;
    const actualizadas = eliminarMesa(mesaAEliminar.id);
    setMesas(actualizadas);
    setMesaAEliminar(null);
  };

  const mesasFiltradas = mesas.filter((m) => {
    const q = busqueda.toLowerCase().trim();
    const matchName = !q || m.nombre.toLowerCase().includes(q);
    const matchEstado = filtroEstado === "TODAS" || m.estado === filtroEstado;
    return matchName && matchEstado;
  });

  const libres = mesas.filter((m) => m.estado === "LIBRE").length;
  const consumo = mesas.filter((m) => m.estado === "EN_CONSUMO").length;
  const porCobrar = mesas.filter((m) => m.estado === "POR_COBRAR").length;

  return (
    <div className="space-y-6">
      {/* ── Stats de estado ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4">
        {/* Libres */}
        <div
          onClick={() => setFiltroEstado(filtroEstado === "LIBRE" ? "TODAS" : "LIBRE")}
          className={`
            relative p-4 rounded-2xl border cursor-pointer transition-all duration-200
            flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5
            ${filtroEstado === "LIBRE"
              ? "border-emerald-500/50 shadow-emerald-500/10 ring-1 ring-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5"
              : "border-border hover:border-emerald-500/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${filtroEstado === "LIBRE" ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20" : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"}`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Disponibles</p>
          </div>
          <p className="text-2xl font-black text-foreground">{libres}</p>
        </div>

        {/* En consumo */}
        <div
          onClick={() => setFiltroEstado(filtroEstado === "EN_CONSUMO" ? "TODAS" : "EN_CONSUMO")}
          className={`
            relative p-4 rounded-2xl border cursor-pointer transition-all duration-200
            flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5
            ${filtroEstado === "EN_CONSUMO"
              ? "border-indigo-500/50 shadow-indigo-500/10 ring-1 ring-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5"
              : "border-border hover:border-indigo-500/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${filtroEstado === "EN_CONSUMO" ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20" : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"}`}>
              <Activity className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">En servicio</p>
          </div>
          <p className="text-2xl font-black text-foreground">{consumo}</p>
        </div>

        {/* Por cobrar */}
        <div
          onClick={() => setFiltroEstado(filtroEstado === "POR_COBRAR" ? "TODAS" : "POR_COBRAR")}
          className={`
            relative p-4 rounded-2xl border cursor-pointer transition-all duration-200
            flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5
            ${filtroEstado === "POR_COBRAR"
              ? "border-rose-500/50 shadow-rose-500/10 ring-1 ring-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5"
              : "border-border hover:border-rose-500/30"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${filtroEstado === "POR_COBRAR" ? "bg-rose-500 text-white shadow-md shadow-rose-500/20" : "bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400"}`}>
              <Receipt className="h-5 w-5" />
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Por cobrar</p>
          </div>
          <p className="text-2xl font-black text-foreground">{porCobrar}</p>
        </div>
      </div>

      {/* ── Barra de búsqueda + agregar ──────────────────────────────────── */}
      <div className="flex items-center gap-3 bg-card p-2.5 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar venta..."
            className="
              w-full pl-10 pr-4 py-2 text-sm rounded-xl
              bg-muted/40 border border-transparent text-foreground
              placeholder:text-muted-foreground
              focus:outline-none focus:bg-background focus:border-primary/40 focus:ring-2 focus:ring-primary/20
              transition-all duration-200
            "
          />
        </div>

        <button
          onClick={handleAgregarMesa}
          className="
            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold
            bg-primary text-primary-foreground hover:bg-primary/90 
            shadow-sm active:scale-[0.98] transition-all duration-150
          "
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Venta</span>
        </button>
      </div>

      {/* ── Contador ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1 -mb-2">
        <span>
          <strong className="text-foreground font-semibold">{mesasFiltradas.length}</strong>{" "}
          {mesasFiltradas.length === 1 ? "venta encontrada" : "ventas encontradas"}
        </span>
      </div>

      {/* ── Grid de mesas ────────────────────────────────────────────────── */}
      {mesasFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-3xl border border-border/50 border-dashed">
          <div className="h-14 w-14 rounded-3xl bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">No se encontraron ventas</p>
          <p className="text-xs text-muted-foreground mt-1">
            {busqueda || filtroEstado !== "TODAS" ? "Intenta ajustando los filtros de búsqueda." : "Aún no has agregado ninguna venta."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mesasFiltradas.map((mesa) => (
            <MesaCard key={mesa.id} mesa={mesa} onClick={handleMesaClick} onEliminar={handleEliminarMesa} />
          ))}

          {/* ── Botón agregar mesa (al final de la grid) ─────────────────── */}
          <AgregarMesaCard onClick={handleAgregarMesa} />
        </div>
      )}
      {/* ── Custom Deletion Confirmation Modal ────────────────────────────── */}
      {mesaAEliminar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMesaAEliminar(null)}
        >
          <div
            className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-rose-50/20 dark:bg-rose-950/10">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <Trash2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-extrabold text-foreground">Eliminar Venta</h3>
              </div>
              <button
                onClick={() => setMesaAEliminar(null)}
                className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-center sm:text-left">
              <p className="text-xs text-muted-foreground">
                ¿Estás seguro de que deseas eliminar la venta <strong className="text-foreground">"{mesaAEliminar.nombre}"</strong>? Esta acción no se puede deshacer.
              </p>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3.5 bg-muted/30 border-t border-border flex items-center justify-end gap-2.5">
              <button
                onClick={() => setMesaAEliminar(null)}
                className="px-3.5 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-accent text-xs font-semibold shadow-sm transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminarMesa}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] text-xs font-bold shadow-sm transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
