import { History, ArrowUpRight, ArrowDownRight, Sliders } from "lucide-react";

interface Props {
  total: number;
  entradas: number;
  salidas: number;
  ajustes: number;
}

export default function KardexStats({ total, entradas, salidas, ajustes }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Movimientos */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-slate-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <History className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Movimientos</p>
        </div>
        <p className="text-2xl font-black text-foreground">{total.toLocaleString()}</p>
      </div>

      {/* Entradas */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Entradas</p>
        </div>
        <p className="text-2xl font-black text-foreground">{entradas.toLocaleString()}</p>
      </div>

      {/* Salidas */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Salidas</p>
        </div>
        <p className="text-2xl font-black text-foreground">{salidas.toLocaleString()}</p>
      </div>

      {/* Ajustes */}
      <div className="relative p-4 rounded-2xl border border-border cursor-default transition-all duration-200 flex items-center justify-between bg-card hover:shadow-md hover:-translate-y-0.5 hover:border-violet-500/30">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400">
            <Sliders className="h-5 w-5" />
          </div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-muted-foreground">Ajustes</p>
        </div>
        <p className="text-2xl font-black text-foreground">{ajustes.toLocaleString()}</p>
      </div>
    </div>
  );
}


