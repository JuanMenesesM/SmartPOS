interface Props {
  activo: boolean;
}

export default function ProductoStatusBadge({ activo }: Props) {
  if (activo) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Activo
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
      Inactivo
    </span>
  );
}
