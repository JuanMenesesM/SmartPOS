import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Plus,
  Loader2,
  Search,
  Sparkles,
  MessageSquare,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  ClipboardList,
  Save,
  AlertTriangle,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  X,
  KeyRound,
  Copy,
  Check,
  Hash,
  Lock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  listarEmpresasAdmin,
  toggleLicenciaAdmin,
  actualizarModulosAdmin,
  createEmpresa,
} from "@/services/empresa.service";

interface ModulosState {
  pos: boolean;
  inventario: boolean;
  compras: boolean;
  kardex: boolean;
  auditoria: boolean;
  whatsapp: boolean;
  ia: boolean;
}

const MODULOS_DEF: { key: keyof ModulosState; label: string; icon: any; desc: string; pro?: boolean }[] = [
  { key: "pos",        label: "Punto de Venta", icon: ShoppingCart, desc: "Caja y cobro de facturas" },
  { key: "inventario", label: "Inventario",     icon: Package,      desc: "Gestión de catálogo de productos" },
  { key: "compras",    label: "Compras",        icon: Truck,        desc: "Ingreso de facturas de proveedores" },
  { key: "kardex",     label: "Kardex",         icon: FileText,     desc: "Control de entradas y salidas" },
  { key: "auditoria",  label: "Auditoría",      icon: ClipboardList,desc: "Bitácora de movimientos" },
  { key: "whatsapp",   label: "WhatsApp Auto",  icon: MessageSquare,desc: "Disparo de facturas y resúmenes", pro: true },
  { key: "ia",         label: "Asistente IA",   icon: Sparkles,     desc: "Análisis inteligente de ventas",  pro: true },
];

export default function ControlPage() {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [credencialesCreadas, setCredencialesCreadas] = useState<{
    nombre: string;
    correo: string;
    clave: string;
  } | null>(null);
  const [copiado, setCopiado] = useState(false);

  // Formulario nuevo cliente
  const [nuevoForm, setNuevoForm] = useState({
    nombre: "",
    nit: "",
    telefono: "",
    correo: "",
    ciudad: "",
    modulos: {
      pos: true,
      inventario: true,
      compras: true,
      kardex: true,
      auditoria: true,
      whatsapp: false,
      ia: false,
    },
  });

  const cargarEmpresas = async () => {
    setIsLoading(true);
    try {
      const data = await listarEmpresasAdmin();
      setEmpresas(data);
    } catch (err: any) {
      toast.error("Error al cargar la lista de empresas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const handleToggleLicencia = async (id: number, nombre: string) => {
    try {
      const res = await toggleLicenciaAdmin(id);
      toast.success(res.message);
      setEmpresas((prev) =>
        prev.map((e) => (e.id === id ? { ...e, licenciaActiva: res.empresa.licenciaActiva } : e))
      );
    } catch {
      toast.error("No se pudo cambiar el estado de la licencia");
    }
  };

  const handleToggleModuloLocal = (empresaId: number, moduloKey: keyof ModulosState) => {
    setEmpresas((prev) =>
      prev.map((e) => {
        if (e.id !== empresaId) return e;
        const cfg = e.configuracion || {};
        const modulosActuales = cfg.modulos || {
          pos: true,
          inventario: true,
          compras: true,
          kardex: true,
          auditoria: true,
          whatsapp: false,
          ia: false,
        };
        const nuevoValor = !modulosActuales[moduloKey];
        return {
          ...e,
          _hasChanges: true,
          configuracion: {
            ...cfg,
            modulos: {
              ...modulosActuales,
              [moduloKey]: nuevoValor,
            },
          },
        };
      })
    );
  };

  const handleGuardarModulos = async (empresa: any) => {
    setSavingId(empresa.id);
    try {
      const modulos = empresa.configuracion?.modulos || {};
      await actualizarModulosAdmin(empresa.id, modulos);
      toast.success(`Módulos actualizados para ${empresa.nombre}`);
      setEmpresas((prev) =>
        prev.map((e) => (e.id === empresa.id ? { ...e, _hasChanges: false } : e))
      );
    } catch {
      toast.error("Error al guardar los módulos");
    } finally {
      setSavingId(null);
    }
  };

  const handleCopiarCredenciales = () => {
    if (!credencialesCreadas) return;
    const texto = `⚡ ¡Bienvenido a SmartPOS! ⚡

Tus credenciales de acceso son:
🏢 Empresa: ${credencialesCreadas.nombre}
📧 Correo: ${credencialesCreadas.correo}
🔑 Contraseña inicial: ${credencialesCreadas.clave}

👉 Ingresa en la aplicación de escritorio o web.
💡 Por seguridad, te sugerimos cambiar tu contraseña al ingresar desde el módulo de "Configuración ➜ Seguridad".`;

    navigator.clipboard.writeText(texto);
    setCopiado(true);
    toast.success("¡Mensaje de credenciales copiado!");
    setTimeout(() => setCopiado(false), 3000);
  };

  const handleCrearCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoForm.nombre.trim()) {
      toast.error("El nombre del negocio es obligatorio");
      return;
    }
    if (!nuevoForm.correo.trim()) {
      toast.error("El correo electrónico es requerido para el usuario administrador");
      return;
    }
    setCreating(true);
    try {
      const res: any = await createEmpresa({
        nombre: nuevoForm.nombre,
        nit: nuevoForm.nit || undefined,
        telefono: nuevoForm.telefono || undefined,
        correo: nuevoForm.correo.trim(),
        ciudad: nuevoForm.ciudad || undefined,
        configuracion: {
          modulos: nuevoForm.modulos,
        },
      });

      setIsModalOpen(false);

      if (res?.credenciales) {
        setCredencialesCreadas({
          nombre: nuevoForm.nombre,
          correo: res.credenciales.correo,
          clave: res.credenciales.clave,
        });
      } else {
        toast.success("¡Nuevo cliente registrado exitosamente!");
      }

      setNuevoForm({
        nombre: "",
        nit: "",
        telefono: "",
        correo: "",
        ciudad: "",
        modulos: {
          pos: true,
          inventario: true,
          compras: true,
          kardex: true,
          auditoria: true,
          whatsapp: false,
          ia: false,
        },
      });
      cargarEmpresas();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error al crear la empresa");
    } finally {
      setCreating(false);
    }
  };

  const empresasFiltradas = empresas.filter((e) => {
    const q = search.toLowerCase();
    return (
      e.nombre?.toLowerCase().includes(q) ||
      e.nit?.toLowerCase().includes(q) ||
      e.ciudad?.toLowerCase().includes(q)
    );
  });

  const totalActivas = empresas.filter((e) => e.licenciaActiva).length;
  const totalWhatsapp = empresas.filter((e) => e.configuracion?.modulos?.whatsapp).length;
  const totalIA = empresas.filter((e) => e.configuracion?.modulos?.ia).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* ── Encabezado ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Plataforma de Control SaaS
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-primary/10 text-primary border border-primary/25">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Administración central de clientes, licencias y activación de módulos por empresa.
            </p>
          </div>
        </div>

        {/* Acciones Superiores */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={cargarEmpresas}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground transition-all shadow-xs"
            title="Recargar listado"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Refrescar</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-500 text-white font-bold text-xs shadow-md shadow-primary/25 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Registrar Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* ── Métricas del Ecosistema SaaS ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Clientes */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Total Clientes</span>
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <p className="text-2xl font-black text-foreground">{empresas.length}</p>
          <p className="text-[11px] text-muted-foreground">Empresas registradas en el sistema</p>
        </div>

        {/* Card 2: Licencias Activas */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Licencias Activas</span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-emerald-500">{totalActivas}</p>
            <span className="text-xs text-muted-foreground">
              / {empresas.length} ({empresas.length > 0 ? Math.round((totalActivas / empresas.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">Operando con acceso total</p>
        </div>

        {/* Card 3: Clientes con WhatsApp */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Módulo WhatsApp</span>
            <MessageSquare className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalWhatsapp}</p>
          <p className="text-[11px] text-muted-foreground">Con n8n y Evolution API activos</p>
        </div>

        {/* Card 4: Clientes con IA */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Módulo IA</span>
            <Sparkles className="h-4 w-4 text-violet-500" />
          </div>
          <p className="text-2xl font-black text-foreground">{totalIA}</p>
          <p className="text-[11px] text-muted-foreground">Con OpenAI habilitado</p>
        </div>
      </div>

      {/* ── Barra de Búsqueda ─────────────────────────────────────────────────── */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente por nombre, NIT o ciudad..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all font-medium"
        />
      </div>

      {/* ── Listado de Empresas / Clientes ──────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-semibold">
            Cargando ecosistema de clientes...
          </span>
        </div>
      ) : empresasFiltradas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <Building2 className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
          <p className="text-sm font-bold text-foreground">No se encontraron clientes</p>
          <p className="text-xs text-muted-foreground">
            Intenta con otro término de búsqueda o registra un nuevo cliente.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {empresasFiltradas.map((empresa) => {
            const config = empresa.configuracion || {};
            const modulos: ModulosState = {
              pos: true,
              inventario: true,
              compras: true,
              kardex: true,
              auditoria: true,
              whatsapp: false,
              ia: false,
              ...(config.modulos || {}),
            };

            return (
              <div
                key={empresa.id}
                className="rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-6 shadow-sm hover:shadow-md transition-all space-y-5"
              >
                {/* Cabecera de la Tarjeta del Cliente */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-violet-500/20 to-primary/5 border border-primary/25 text-primary font-black text-lg shadow-sm">
                      {empresa.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-foreground">
                          {empresa.nombre}
                        </h3>
                        <span className="text-xs text-muted-foreground font-mono">
                          (ID #{empresa.id})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                        {empresa.nit && (
                          <span className="font-mono">NIT: {empresa.nit}</span>
                        )}
                        {empresa.ciudad && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {empresa.ciudad}
                          </span>
                        )}
                        {empresa.telefono && (
                          <span className="flex items-center gap-1 font-mono">
                            <Phone className="h-3 w-3" /> {empresa.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Switch Maestro de Licencia y Botón Guardar */}
                  <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                    {/* Botón de Guardar Cambios con color vibrante permanente */}
                    <button
                      onClick={() => handleGuardarModulos(empresa)}
                      disabled={savingId === empresa.id}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                        empresa._hasChanges
                          ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/30 hover:brightness-110 ring-2 ring-orange-400/50 animate-pulse"
                          : "bg-gradient-to-r from-primary via-violet-600 to-primary text-white shadow-primary/25 hover:brightness-110 hover:shadow-lg hover:shadow-primary/30"
                      }`}
                    >
                      {savingId === empresa.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Save className="h-3.5 w-3.5" />
                      )}
                      <span>Guardar Cambios</span>
                      {empresa._hasChanges && (
                        <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                      )}
                    </button>

                    {/* Botón Toggle Licencia */}
                    <button
                      onClick={() => handleToggleLicencia(empresa.id, empresa.nombre)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all shadow-xs ${
                        empresa.licenciaActiva
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25 hover:bg-emerald-500/10 hover:text-emerald-500 hover:border-emerald-500/30"
                      }`}
                    >
                      {empresa.licenciaActiva ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                          <span>Licencia Activa</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5 text-red-500" />
                          <span>Licencia Suspendida</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Grid de Módulos Habilitados para este cliente */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Módulos Habilitados en su Software
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Haz clic en un módulo para activar o suspender
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                    {MODULOS_DEF.map((m) => {
                      const Icon = m.icon;
                      const isActive = modulos[m.key];

                      return (
                        <button
                          key={m.key}
                          type="button"
                          onClick={() => handleToggleModuloLocal(empresa.id, m.key)}
                          className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all select-none group ${
                            isActive
                              ? "bg-primary/5 border-primary/40 shadow-xs text-foreground"
                              : "bg-muted/30 border-border/60 text-muted-foreground/60 hover:border-border hover:bg-muted/50"
                          }`}
                        >
                          {/* Badge PRO si aplica */}
                          {m.pro && (
                            <span className="absolute top-1.5 right-1.5 px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider bg-violet-500/20 text-violet-400 border border-violet-500/30">
                              PRO
                            </span>
                          )}

                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl mb-1.5 transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <span className="text-xs font-bold leading-tight line-clamp-1">
                            {m.label}
                          </span>

                          <span
                            className={`text-[10px] font-extrabold mt-1 ${
                              isActive
                                ? "text-emerald-500"
                                : "text-muted-foreground/60"
                            }`}
                          >
                            {isActive ? "Activo" : "Inactivo"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Barra de Guardar y Estado del Cliente */}
                <div className="flex items-center justify-between pt-3 border-t border-border/60 flex-wrap gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    {empresa._hasChanges ? (
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                        Tienes cambios sin guardar en los módulos
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        Módulos guardados en base de datos
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleGuardarModulos(empresa)}
                    disabled={savingId === empresa.id}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 ${
                      empresa._hasChanges
                        ? "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/30 hover:brightness-110 ring-2 ring-orange-400/50 animate-pulse"
                        : "bg-gradient-to-r from-primary via-violet-600 to-primary text-white shadow-primary/25 hover:brightness-110 hover:shadow-lg hover:shadow-primary/30"
                    }`}
                  >
                    {savingId === empresa.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>Guardar Cambios</span>
                  </button>
                </div>

                {/* Info rápida */}
                <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>Usuarios: <strong>{empresa._count?.usuarios ?? 0}</strong></span>
                  <span>•</span>
                  <span>Ventas procesadas: <strong>{empresa._count?.ventas ?? 0}</strong></span>
                  <span>•</span>
                  <span>Productos en catálogo: <strong>{empresa._count?.productos ?? 0}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal: Registrar Nuevo Cliente (Teleport a document.body) ─────────────────────────── */}
      {isModalOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-border/80 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header Modal - Fijo */}
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3.5 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-violet-500/20 to-primary/5 border border-primary/25 text-primary shadow-xs">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-foreground leading-tight">
                      Registrar Nuevo Cliente
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-primary/10 text-primary border border-primary/25">
                      Licencia
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Crea la cuenta del negocio y personaliza sus módulos de acceso
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Formulario con scroll independiente y diseño visual amigable */}
            <form onSubmit={handleCrearCliente} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              
              {/* Sección 1: Datos del Negocio */}
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-primary" /> 1. Datos del Negocio
                </span>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">
                    Nombre Comercial o Razón Social <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                    <input
                      required
                      value={nuevoForm.nombre}
                      onChange={(e) => setNuevoForm({ ...nuevoForm, nombre: e.target.value })}
                      placeholder="Ej. Tienda Mi Progreso S.A.S"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">NIT / Identificación Fiscal</label>
                    <div className="relative">
                      <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                      <input
                        value={nuevoForm.nit}
                        onChange={(e) => setNuevoForm({ ...nuevoForm, nit: e.target.value })}
                        placeholder="Ej. 900.876.543-1"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Ciudad / Municipio</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                      <input
                        value={nuevoForm.ciudad}
                        onChange={(e) => setNuevoForm({ ...nuevoForm, ciudad: e.target.value })}
                        placeholder="Ej. Medellín, Antioquia"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 2: Contacto y Usuario Administrador */}
              <div className="space-y-3 pt-3 border-t border-border">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> 2. Contacto y Cuenta Administradora
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Teléfono / WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                      <input
                        value={nuevoForm.telefono}
                        onChange={(e) => setNuevoForm({ ...nuevoForm, telefono: e.target.value })}
                        placeholder="Ej. 312 807 5096"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Correo de Inicio de Sesión <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
                      <input
                        required
                        type="email"
                        value={nuevoForm.correo}
                        onChange={(e) => setNuevoForm({ ...nuevoForm, correo: e.target.value })}
                        placeholder="admin@tienda.com"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-border bg-muted/30 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección 3: Contraseña Inicial Automática */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-primary/20 bg-primary/5 text-xs">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-foreground">
                      Contraseña inicial asignada:
                    </span>
                    <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      Temporal
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="px-2.5 py-1 rounded-lg bg-background border border-primary/25 text-primary font-mono font-black text-xs select-all">
                      SmartPOS2026+
                    </code>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-tight">
                    Esta clave se entregará al cliente para su primer ingreso. Podrá personalizarla luego en <strong>Configuración ➜ Seguridad</strong>.
                  </p>
                </div>
              </div>

              {/* Sección 4: Módulos Habilitados */}
              <div className="space-y-3 pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" /> 3. Módulos Iniciales Contratados
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    Haz clic para activar o desactivar
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MODULOS_DEF.map((m) => {
                    const Icon = m.icon;
                    const isChecked = nuevoForm.modulos[m.key];
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() =>
                          setNuevoForm({
                            ...nuevoForm,
                            modulos: {
                              ...nuevoForm.modulos,
                              [m.key]: !isChecked,
                            },
                          })
                        }
                        className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isChecked
                            ? "bg-primary/5 border-primary/40 shadow-xs"
                            : "bg-muted/20 border-border/70 hover:bg-muted/40 opacity-75"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                              isChecked
                                ? "bg-primary text-primary-foreground shadow-xs shadow-primary/25"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-foreground">
                                {m.label}
                              </span>
                              {m.pro && (
                                <span className="px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase bg-violet-500/20 text-violet-400 border border-violet-500/30">
                                  PRO
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground block line-clamp-1">
                              {m.desc}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-lg border transition-all ${
                            isChecked
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border bg-card"
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botones del Modal */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-violet-600 hover:brightness-110 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-primary/25 disabled:opacity-60 transition-all"
                >
                  {creating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span>{creating ? "Registrando..." : "Registrar Empresa"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ── Modal: Credenciales Creadas Exitosamente (Teleport a document.body) ─────────────────────────── */}
      {credencialesCreadas && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-3xl border border-primary/30 bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 pb-3.5 border-b border-border bg-card/95 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-xs">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-foreground leading-tight">
                    ¡Cliente Registrado con Éxito!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Se generaron las credenciales de acceso iniciales para el cliente
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCredencialesCreadas(null)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
                title="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
              {/* Resumen de datos */}
              <div className="space-y-2.5 rounded-2xl border border-border bg-muted/30 p-4 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Empresa:</span>
                  <span className="font-extrabold text-foreground">{credencialesCreadas.nombre}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground font-medium">Usuario / Correo:</span>
                  <span className="font-bold font-mono text-foreground">{credencialesCreadas.correo}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground font-medium">Contraseña Inicial:</span>
                  <div className="flex items-center gap-2">
                    <code className="px-2.5 py-0.5 rounded-md bg-primary/10 text-primary font-mono font-bold text-xs">
                      {credencialesCreadas.clave}
                    </code>
                  </div>
                </div>
              </div>

              {/* Vista previa del mensaje listo para enviar */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Mensaje listo para compartir (WhatsApp / Correo):
                </label>
                <pre className="p-3.5 rounded-2xl border border-border bg-card/60 text-[11px] text-foreground font-mono leading-relaxed whitespace-pre-wrap select-all">
{`⚡ ¡Bienvenido a SmartPOS! ⚡

Tus credenciales de acceso son:
🏢 Empresa: ${credencialesCreadas.nombre}
📧 Correo: ${credencialesCreadas.correo}
🔑 Contraseña inicial: ${credencialesCreadas.clave}

👉 Ingresa en la aplicación de escritorio o web.
💡 Por seguridad, te sugerimos cambiar tu contraseña al ingresar desde el módulo de "Configuración ➜ Seguridad".`}
                </pre>
              </div>

              {/* Alerta de sugerencia */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Recuerda indicarle al cliente que una vez que inicie sesión, debe ingresar a <strong>Configuración ➜ Seguridad</strong> para actualizar su contraseña por una privada.
                </p>
              </div>
            </div>

            {/* Acciones Footer */}
            <div className="flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur-sm shrink-0">
              <button
                type="button"
                onClick={() => setCredencialesCreadas(null)}
                className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleCopiarCredenciales}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
              >
                {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiado ? "¡Copiado al Portapapeles!" : "Copiar para WhatsApp"}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
