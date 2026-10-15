import { AccionAuditoria, ModuloAuditoria } from "@/types/auditoria";

// ── Badge de Acción ───────────────────────────────────────────────────────────
const ACCION_CONFIG: Record<string, { label: string; badgeClasses: string; dotClasses: string; accentLine: string }> = {
  CREAR: {
    label: "Crear",
    badgeClasses: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClasses: "bg-emerald-500",
    accentLine: "bg-emerald-500",
  },
  EDITAR: {
    label: "Editar",
    badgeClasses: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    dotClasses: "bg-amber-500",
    accentLine: "bg-amber-500",
  },
  ELIMINAR: {
    label: "Eliminar",
    badgeClasses: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    dotClasses: "bg-rose-500",
    accentLine: "bg-rose-500",
  },
  LOGIN: {
    label: "Login",
    badgeClasses: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    dotClasses: "bg-blue-500",
    accentLine: "bg-blue-500",
  },
  LOGOUT: {
    label: "Logout",
    badgeClasses: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
    dotClasses: "bg-slate-400",
    accentLine: "bg-slate-400",
  },
  EXPORTAR: {
    label: "Exportar",
    badgeClasses: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    dotClasses: "bg-violet-500",
    accentLine: "bg-violet-500",
  },
};

// ── Badge de Módulo ───────────────────────────────────────────────────────────
const MODULO_CONFIG: Record<string, { label: string; badgeClasses: string; dotClasses: string }> = {
  Productos: {
    label: "Productos",
    badgeClasses: "bg-primary/10 text-primary border-primary/20",
    dotClasses: "bg-primary",
  },
  Ventas: {
    label: "Ventas",
    badgeClasses: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    dotClasses: "bg-indigo-500",
  },
  Compras: {
    label: "Compras",
    badgeClasses: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    dotClasses: "bg-emerald-500",
  },
  Usuarios: {
    label: "Usuarios",
    badgeClasses: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    dotClasses: "bg-violet-500",
  },
  Empresa: {
    label: "Empresa",
    badgeClasses: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    dotClasses: "bg-sky-500",
  },
  Dashboard: {
    label: "Dashboard",
    badgeClasses: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    dotClasses: "bg-cyan-500",
  },
  Configuracion: {
    label: "Configuración",
    badgeClasses: "bg-muted text-muted-foreground border-border",
    dotClasses: "bg-muted-foreground",
  },
};

export function AccionBadge({ accion }: { accion: AccionAuditoria | string }) {
  const normalizada = String(accion || "").toUpperCase();
  const cfg = ACCION_CONFIG[normalizada] ?? {
    label: accion,
    badgeClasses: "bg-muted text-muted-foreground border-border",
    dotClasses: "bg-muted-foreground",
    accentLine: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shadow-xs ${cfg.badgeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClasses}`} />
      <span>{cfg.label}</span>
    </span>
  );
}

export function ModuloBadge({ modulo }: { modulo: ModuloAuditoria | string }) {
  const cfg = MODULO_CONFIG[modulo] ?? {
    label: modulo,
    badgeClasses: "bg-muted text-muted-foreground border-border",
    dotClasses: "bg-muted-foreground",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold shadow-xs ${cfg.badgeClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dotClasses}`} />
      <span>{cfg.label}</span>
    </span>
  );
}

export function getAccionAccentLine(accion: AccionAuditoria | string): string {
  const normalizada = String(accion || "").toUpperCase();
  return ACCION_CONFIG[normalizada]?.accentLine ?? "bg-slate-400";
}
