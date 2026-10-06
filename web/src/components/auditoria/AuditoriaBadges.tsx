import { AccionAuditoria, ModuloAuditoria } from "@/types/auditoria";

// ── Badge de Acción ───────────────────────────────────────────────────────────
const ACCION_CONFIG: Record<AccionAuditoria, { label: string; classes: string; accentLine: string }> = {
  CREAR:    { label: "Crear",    classes: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/40",  accentLine: "bg-emerald-500"  },
  EDITAR:   { label: "Editar",   classes: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40",          accentLine: "bg-amber-500"    },
  ELIMINAR: { label: "Eliminar", classes: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/40",              accentLine: "bg-rose-500"     },
  LOGIN:    { label: "Login",    classes: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/40",              accentLine: "bg-blue-500"     },
  LOGOUT:   { label: "Logout",   classes: "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/40",          accentLine: "bg-slate-400"    },
  EXPORTAR: { label: "Exportar", classes: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/40",     accentLine: "bg-violet-500"   },
};

// ── Badge de Módulo ───────────────────────────────────────────────────────────
const MODULO_CONFIG: Record<ModuloAuditoria, { label: string; classes: string }> = {
  Productos:     { label: "Productos",     classes: "bg-primary/10 text-primary border-primary/30"                            },
  Ventas:        { label: "Ventas",        classes: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30" },
  Compras:       { label: "Compras",       classes: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/30"       },
  Usuarios:      { label: "Usuarios",      classes: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30"},
  Empresa:       { label: "Empresa",       classes: "bg-slate-500/10 text-slate-700 dark:text-slate-400 border-slate-500/30"   },
  Dashboard:     { label: "Dashboard",     classes: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/30"       },
  Configuracion: { label: "Config",        classes: "bg-muted text-muted-foreground border-border"                             },
};

export function AccionBadge({ accion }: { accion: AccionAuditoria }) {
  const cfg = ACCION_CONFIG[accion] ?? ACCION_CONFIG.EDITAR;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-extrabold tracking-wider uppercase ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export function ModuloBadge({ modulo }: { modulo: ModuloAuditoria }) {
  const cfg = MODULO_CONFIG[modulo] ?? MODULO_CONFIG.Configuracion;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-semibold ${cfg.classes}`}>
      {cfg.label}
    </span>
  );
}

export function getAccionAccentLine(accion: AccionAuditoria): string {
  return ACCION_CONFIG[accion]?.accentLine ?? "bg-slate-400";
}
