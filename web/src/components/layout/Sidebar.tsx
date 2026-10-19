import { NavLink } from "react-router-dom";
import {
  X,
  Zap,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  ClipboardList,
  Building2,
  Settings,
  ShieldCheck,
  Lock
} from "lucide-react";
import { isSuperAdmin, hasModule, ModulosConfig } from "@/services/auth.service";

interface NavItem {
  to: string;
  label: string;
  icon: any;
  modulo?: keyof ModulosConfig;
  badge?: string;
}

const baseNavGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Principal",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { to: "/productos", label: "Productos", icon: Package, modulo: "inventario" },
      { to: "/ventas",    label: "Ventas",    icon: ShoppingCart, modulo: "pos" },
      { to: "/compras",   label: "Compras",   icon: Truck, modulo: "compras" },
      { to: "/kardex",    label: "Kardex",    icon: FileText, modulo: "kardex" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { to: "/auditoria",     label: "Auditoría",     icon: ClipboardList, modulo: "auditoria" },
      { to: "/empresa",       label: "Empresa",       icon: Building2 },
      { to: "/configuracion", label: "Configuración", icon: Settings },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const superAdmin = isSuperAdmin();

  const navGroups = [
    ...baseNavGroups,
    ...(superAdmin
      ? [
          {
            label: "Control de Licencias",
            items: [
              {
                to: "/control",
                label: "Panel SaaS Control",
                icon: ShieldCheck,
                badge: "SuperAdmin",
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-30 flex w-56 flex-col bg-card border-r border-border",
          "transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >

        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center justify-between gap-2.5 px-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-md shadow-primary/30">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              SmartPOS
            </span>
          </div>

          {/* Botón cerrar — solo mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-7">
          {navGroups.map((group) => (
            <div key={group.label}>
              {/* Etiqueta de sección */}
              <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {group.label}
              </p>

              {/* Items */}
              <div className="space-y-0.5">
                {group.items.map(({ to, label, icon: Icon, modulo, badge }) => {
                  const estaHabilitado = !modulo || hasModule(modulo);

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                          isActive
                            ? "bg-primary/10 text-primary border-l-4 border-primary pl-[9px]"
                            : "text-muted-foreground border-l-4 border-transparent pl-[9px] hover:bg-accent hover:text-foreground",
                          !estaHabilitado ? "opacity-75" : "",
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3 min-w-0">
                            <Icon
                              className={[
                                "h-4 w-4 shrink-0 transition-colors",
                                isActive ? "text-primary" : "group-hover:text-foreground",
                              ].join(" ")}
                            />
                            <span className="truncate">{label}</span>
                          </div>

                          {/* Badge de Inactivo o Badge SuperAdmin */}
                          {!estaHabilitado && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
                          )}
                          {badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-primary/15 text-primary border border-primary/25 shrink-0">
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground/50 text-center">
            SmartPOS v1.0.0
          </p>
        </div>

      </aside>
    </>
  );
}