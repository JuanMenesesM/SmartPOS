import { CheckCircle2, Ban } from "lucide-react";

interface Props {
  activo: boolean;
}

export default function CompraStatusBadge({ activo }: Props) {
  if (!activo) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-rose-500/5 shadow-[0_0_10px_rgba(244,63,94,0.15)] transition-all hover:shadow-[0_0_15px_rgba(244,63,94,0.25)]">
        <Ban className="h-3 w-3 text-rose-500" />
        <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
          Anulada
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 shadow-[0_0_10px_rgba(16,185,129,0.15)] transition-all hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]">
      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
        Recibida
      </span>
    </div>
  );
}
