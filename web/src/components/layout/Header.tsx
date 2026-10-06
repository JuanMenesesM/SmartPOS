import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, User, ChevronDown, Menu, Search, LogOut, Settings } from "lucide-react";
import { clearAuth } from "@/services/auth.service";
import { useProductos } from "@/hooks/useProductos";

const routeLabels: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/productos":     "Productos",
  "/ventas":        "Ventas",
  "/compras":       "Compras",
  "/kardex":        "Kardex",
  "/auditoria":     "Auditoría",
  "/empresa":       "Empresa",
  "/configuracion": "Configuración",
};

interface HeaderProps {
  onMenuOpen: () => void;
}

export default function Header({ onMenuOpen }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pageLabel = routeLabels[location.pathname] ?? "SmartPOS";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@smartpos.com");
  const [userRole, setUserRole] = useState("Administrador");
  const [readNotifIds, setReadNotifIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("smartpos_read_notifications");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: productos = [] } = useProductos();

  // Generar notificaciones dinámicas basadas en el inventario
  const notifications = [
    ...productos.filter(p => p.stock === 0).map(p => ({
      id: `no-stock-${p.id}`,
      title: "Stock Agotado",
      msg: `El producto "${p.nombre}" se ha agotado por completo.`,
      icon: "🔴",
    })),
    ...productos.filter(p => p.stock > 0 && p.stock <= 5).map(p => ({
      id: `low-stock-${p.id}`,
      title: "Stock Bajo",
      msg: `El producto "${p.nombre}" tiene solo ${p.stock} unidades restantes.`,
      icon: "📦",
    })),
  ];

  const unreadCount = notifications.filter(n => !readNotifIds.includes(n.id)).length;

  const marcarTodasLeidas = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...readNotifIds, ...allIds]));
    setReadNotifIds(updated);
    try {
      localStorage.setItem("smartpos_read_notifications", JSON.stringify(updated));
    } catch {}
  };

  const toggleNotificaciones = () => {
    const nextState = !notifOpen;
    setNotifOpen(nextState);
    if (nextState && unreadCount > 0) {
      marcarTodasLeidas();
    }
  };

  useEffect(() => {
    try {
      const u = localStorage.getItem("usuario");
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed.nombre) {
          setUserName(`${parsed.nombre} ${parsed.apellido || ""}`.trim());
        }
        if (parsed.correo) {
          setUserEmail(parsed.correo);
        }
        if (parsed.rolId === 1) {
          setUserRole("Administrador");
        } else if (parsed.rolId === 2) {
          setUserRole("Cajero");
        } else if (parsed.rolId === 3) {
          setUserRole("Bodeguero");
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 bg-card border-b border-border z-50">

      {/* Lado izquierdo */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Hamburger — solo mobile */}
        <button
          onClick={onMenuOpen}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb / Título */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground hidden sm:block">SmartPOS</span>
          <span className="text-xs text-muted-foreground hidden sm:block">/</span>
          <span className="text-sm font-semibold text-foreground truncate">{pageLabel}</span>
        </div>
      </div>

      {/* Lado derecho */}
      <div className="flex items-center gap-1.5 shrink-0">

        {/* Búsqueda — solo desktop */}
        <button 
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center justify-between gap-2 w-64 lg:w-80 px-3 py-1.5 rounded-lg border border-border bg-muted/50 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs">Buscar...</span>
          </div>
          <kbd className="text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5">⌘K</kbd>
        </button>

        {/* Notificaciones */}
        <div ref={notifRef} className="relative">
          <button
            onClick={toggleNotificaciones}
            className={`relative p-2 rounded-lg transition-colors ${notifOpen ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent"}`}
            aria-label="Notificaciones"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-1.5 w-80 rounded-xl border border-border bg-card p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
              <div className="px-2 py-1.5 border-b border-border mb-1 flex justify-between items-center">
                <p className="text-sm font-bold text-foreground">Notificaciones</p>
                {unreadCount > 0 ? (
                  <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-semibold">{unreadCount} Nuevas</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-medium">Al día</span>
                )}
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-muted-foreground">No tienes notificaciones pendientes.</div>
                ) : (
                  notifications.map(n => {
                    const isRead = readNotifIds.includes(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (!isRead) {
                            const updated = Array.from(new Set([...readNotifIds, n.id]));
                            setReadNotifIds(updated);
                            localStorage.setItem("smartpos_read_notifications", JSON.stringify(updated));
                          }
                        }}
                        className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                          isRead ? "bg-transparent opacity-70 hover:opacity-100 hover:bg-accent/40" : "bg-primary/5 border border-primary/15 hover:bg-primary/10"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">{n.icon} {n.title}</p>
                          {!isRead && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{n.msg}</p>
                      </div>
                    );
                  })
                )}
              </div>
              {notifications.length > 0 && (
                <div className="mt-1.5 border-t border-border pt-1.5">
                  <button 
                    type="button"
                    onClick={() => { marcarTodasLeidas(); setNotifOpen(false); }}
                    className="w-full py-1.5 text-center text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    Marcar todas como leídas
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="h-6 w-px bg-border mx-0.5" />

        {/* Avatar usuario dropdown container */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((p) => !p)}
            className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-lg transition-colors select-none ${
              dropdownOpen ? "bg-accent text-foreground" : "hover:bg-accent"
            }`}
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-sm">
              <User className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <div className="hidden sm:flex flex-col items-start gap-0.5 text-left">
              <span className="text-sm font-semibold text-foreground leading-tight">{userName}</span>
              <span className="text-xs text-muted-foreground leading-none">{userRole}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-muted-foreground hidden sm:block transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Menú desplegable */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-56 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-xs font-semibold text-foreground truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{userEmail}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate("/configuracion");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-muted-foreground/75" />
                  Configuración
                </button>
              </div>
              <div className="border-t border-border my-1" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Modal de Búsqueda ⌘K */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-20 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center px-4 py-3 border-b border-border">
              <Search className="h-4 w-4 text-muted-foreground mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar módulos, clientes, productos..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button onClick={() => setSearchOpen(false)} className="text-[10px] font-mono bg-muted text-muted-foreground border border-border rounded px-1.5 py-0.5 hover:text-foreground">
                ESC
              </button>
            </div>
            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Enlaces rápidos</div>
              {Object.entries(routeLabels).map(([path, label]) => (
                <button
                  key={path}
                  onClick={() => {
                    setSearchOpen(false);
                    navigate(path);
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors text-left"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

