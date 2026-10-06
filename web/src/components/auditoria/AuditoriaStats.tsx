import { Activity, Users, Package, ShoppingCart } from "lucide-react";

interface Props {
  eventosHoy: number;
  usuariosActivos: number;
  productosModificados: number;
  ventasRegistradas: number;
}

export default function AuditoriaStats({
  eventosHoy,
  usuariosActivos,
  productosModificados,
  ventasRegistradas,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Eventos Hoy */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-slate-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <Activity className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Eventos Hoy</p>
        </div>
        <p className="text-2xl font-black text-foreground">{eventosHoy.toLocaleString()}</p>
      </div>

      {/* Usuarios Activos */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Usuarios</p>
        </div>
        <p className="text-2xl font-black text-foreground">{usuariosActivos.toLocaleString()}</p>
      </div>

      {/* Productos Modificados */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
            <Package className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Productos</p>
        </div>
        <p className="text-2xl font-black text-foreground">{productosModificados.toLocaleString()}</p>
      </div>

      {/* Ventas Registradas */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Ventas</p>
        </div>
        <p className="text-2xl font-black text-foreground">{ventasRegistradas.toLocaleString()}</p>
      </div>
    </div>
  );
}

