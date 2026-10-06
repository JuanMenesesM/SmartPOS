import { useState, useEffect } from "react";
import { Users, Building2, Package, LayoutDashboard, TrendingUp, Shield, RefreshCw, ShoppingBag, Calendar, Mail, Landmark } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000";
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function formatCOP(amount: number): string {
  return `$${new Intl.NumberFormat("es-CO").format(amount)}`;
}

interface Empresa {
  id: number;
  nombre: string;
  nit: string | null;
  correo: string | null;
  telefono: string | null;
  ciudad: string | null;
  activo: boolean;
  licenciaActiva: boolean;
  _count?: {
    usuarios: number;
  };
}

interface UsuarioGlobal {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  activo: boolean;
  empresaId: number | null;
  empresa?: {
    nombre: string;
  } | null;
  rol?: {
    id: number;
    nombre: string;
    activo: boolean;
  } | null;
}

interface VentaGlobal {
  id: number;
  fecha: string;
  total: number;
  activo: boolean;
  usuario: {
    nombre: string;
    correo: string;
  };
  empresa?: {
    nombre: string;
  } | null;
  detalles: Array<{
    id: number;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: {
      nombre: string;
    };
  }>;
}

interface AdminStats {
  totalEmpresas: number;
  totalUsuarios: number;
  totalProductos: number;
  totalVentas: number;
  ventasCOP: number;
}

function StatCard({
  icon: Icon,
  label,
  value,
  colorClass,
  bgClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  colorClass: string;
  bgClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-200">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-16 w-16" />
      </div>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgClass} ${colorClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="text-xs font-semibold text-muted-foreground">{label}</h3>
      </div>
      <p className="text-2xl font-black text-foreground tracking-tight tabular-nums">{value}</p>
    </div>
  );
}

type TabType = "empresas" | "usuarios" | "ventas";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("empresas");
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioGlobal[]>([]);
  const [ventas, setVentas] = useState<VentaGlobal[]>([]);

  const [stats, setStats] = useState<AdminStats>({
    totalEmpresas: 0,
    totalUsuarios: 0,
    totalProductos: 0,
    totalVentas: 0,
    ventasCOP: 0,
  });

  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [empresasRes, usuariosRes, productosRes, ventasRes] = await Promise.allSettled([
        axios.get(`${API_URL}/empresa/admin/list`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/usuarios`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/productos`, { headers: getAuthHeaders() }),
        axios.get(`${API_URL}/ventas`, { headers: getAuthHeaders() }),
      ]);

      const empresasList = empresasRes.status === "fulfilled" ? (empresasRes.value.data as Empresa[]) : [];
      const usuariosList = usuariosRes.status === "fulfilled" ? (usuariosRes.value.data as UsuarioGlobal[]) : [];
      const totalProds = productosRes.status === "fulfilled" ? (productosRes.value.data as any[]).length : 0;
      const ventasList = ventasRes.status === "fulfilled" ? (ventasRes.value.data as VentaGlobal[]) : [];

      const totalVentasSum = ventasList.reduce((acc, curr) => acc + (curr.activo ? curr.total : 0), 0);

      setEmpresas(empresasList);
      setUsuarios(usuariosList);
      setVentas(ventasList);

      setStats({
        totalEmpresas: empresasList.length,
        totalUsuarios: usuariosList.length,
        totalProductos: totalProds,
        totalVentas: ventasList.length,
        ventasCOP: totalVentasSum,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleToggleLicencia = async (id: number) => {
    setTogglingId(id);
    try {
      const response = await axios.patch(
        `${API_URL}/empresa/admin/${id}/licencia`,
        {},
        { headers: getAuthHeaders() }
      );
      
      // Update local states & refetch users list to get latest license status
      setEmpresas((prev) =>
        prev.map((emp) =>
          emp.id === id ? { ...emp, licenciaActiva: response.data.empresa.licenciaActiva } : emp
        )
      );

      // Reload so all tables/context remain fully synced
      fetchAllData();
    } catch (e) {
      alert("Error al cambiar estado de la licencia");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Panel Maestro
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Shield className="h-3 w-3 text-primary shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Control de Licencias y Monitoreo Global — SmartPOS
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchAllData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sincronizar Todo</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={Building2}
          label="Empresas"
          value={loading ? "…" : stats.totalEmpresas}
          colorClass="text-primary"
          bgClass="bg-primary/10"
        />
        <StatCard
          icon={Users}
          label="Usuarios Globales"
          value={loading ? "…" : stats.totalUsuarios}
          colorClass="text-emerald-500"
          bgClass="bg-emerald-500/10"
        />
        <StatCard
          icon={Package}
          label="Productos Globales"
          value={loading ? "…" : stats.totalProductos}
          colorClass="text-blue-500"
          bgClass="bg-blue-500/10"
        />
        <StatCard
          icon={ShoppingBag}
          label="Transacciones"
          value={loading ? "…" : stats.totalVentas}
          colorClass="text-amber-500"
          bgClass="bg-amber-500/10"
        />
        <StatCard
          icon={TrendingUp}
          label="Facturación Global"
          value={loading ? "…" : formatCOP(stats.ventasCOP)}
          colorClass="text-violet-500"
          bgClass="bg-violet-500/10"
        />
      </div>

      {/* Selector de Pestañas (Tabs) */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("empresas")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "empresas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Empresas / Licencias
        </button>
        <button
          onClick={() => setActiveTab("usuarios")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "usuarios"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Usuarios Globales
        </button>
        <button
          onClick={() => setActiveTab("ventas")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
            activeTab === "ventas"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Ventas Globales
        </button>
      </div>

      {/* Contenido Dinámico de Pestañas */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* PESTAÑA: EMPRESAS */}
        {activeTab === "empresas" && (
          <div>
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold text-foreground">Control de Licencias por Empresa</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Desactivar una licencia bloquea inmediatamente el acceso a todos los usuarios de esa empresa.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 text-center">ID</th>
                    <th className="px-5 py-3 text-center">Nombre</th>
                    <th className="px-5 py-3 text-center">NIT</th>
                    <th className="px-5 py-3 text-center">Contacto / Ciudad</th>
                    <th className="px-5 py-3 text-center">Usuarios</th>
                    <th className="px-5 py-3 text-center">Licencia</th>
                    <th className="px-5 py-3 text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading && empresas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">Cargando empresas...</td>
                    </tr>
                  ) : empresas.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No hay empresas registradas.</td>
                    </tr>
                  ) : (
                    empresas.map((emp) => (
                      <tr key={emp.id} className="hover:bg-accent/20 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-muted-foreground text-center">{emp.id}</td>
                        <td className="px-5 py-3.5 font-bold text-foreground text-center">{emp.nombre}</td>
                        <td className="px-5 py-3.5 font-mono text-muted-foreground text-center">{emp.nit || "N/D"}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-center">
                          <div>{emp.ciudad || "No especificada"}</div>
                          <div className="text-[10px] opacity-75">{emp.correo || emp.telefono || ""}</div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-bold">{emp._count?.usuarios ?? 0}</td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              emp.licenciaActiva
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {emp.licenciaActiva ? "Activa" : "Suspendida"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleToggleLicencia(emp.id)}
                              disabled={togglingId === emp.id}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                emp.licenciaActiva
                                  ? "border-rose-500/20 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20"
                                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                              }`}
                            >
                              {emp.licenciaActiva ? "Suspender" : "Activar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA: USUARIOS GLOBALES */}
        {activeTab === "usuarios" && (
          <div>
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold text-foreground">Listado de Usuarios del Sistema</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Muestra todos los usuarios del ecosistema agrupados por su respectiva empresa.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 text-center">ID</th>
                    <th className="px-5 py-3 text-center">Nombre</th>
                    <th className="px-5 py-3 text-center">Empresa</th>
                    <th className="px-5 py-3 text-center">Rol</th>
                    <th className="px-5 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading && usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">Cargando usuarios...</td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No hay usuarios registrados.</td>
                    </tr>
                  ) : (
                    usuarios.map((u) => (
                      <tr key={u.id} className="hover:bg-accent/20 transition-colors">
                        <td className="px-5 py-3.5 font-semibold text-muted-foreground text-center">{u.id}</td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="font-bold text-foreground">{u.nombre} {u.apellido}</div>
                          <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                            <Mail className="h-3 w-3" />
                            <span>{u.correo}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-primary text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Landmark className="h-3.5 w-3.5 opacity-60" />
                            <span>{u.empresa?.nombre || "Sin Empresa"}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <span className="px-2 py-0.5 rounded bg-muted border border-border font-medium">
                              {u.rol?.nombre || "Sin Rol"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="flex justify-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              u.activo
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {u.activo ? "Activo" : "Inactivo"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PESTAÑA: VENTAS GLOBALES */}
        {activeTab === "ventas" && (
          <div>
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-bold text-foreground">Registro de Transacciones Consolidadas</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ventas totales registradas en tiempo real a nivel de plataforma.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30 font-bold text-muted-foreground uppercase tracking-wider">
                    <th className="px-5 py-3 text-center">ID</th>
                    <th className="px-5 py-3 text-center">Fecha</th>
                    <th className="px-5 py-3 text-center">Empresa</th>
                    <th className="px-5 py-3 text-center">Vendedor</th>
                    <th className="px-5 py-3 text-center">Detalle Productos</th>
                    <th className="px-5 py-3 text-center">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {loading && ventas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">Cargando ventas...</td>
                    </tr>
                  ) : ventas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No se registran transacciones.</td>
                    </tr>
                  ) : (
                    ventas.map((v) => (
                      <tr key={v.id} className="hover:bg-accent/20 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-semibold text-muted-foreground text-center">#{v.id}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 opacity-60" />
                            <span>{new Date(v.fecha).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" })}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-primary text-center">
                          {v.empresa?.nombre || "—"}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-foreground text-center">{v.usuario.nombre}</td>
                        <td className="px-5 py-3.5 text-center">
                          <div className="space-y-0.5">
                            {v.detalles.map((det) => (
                              <div key={det.id} className="text-muted-foreground">
                                <span className="font-semibold text-foreground">{det.cantidad}x</span> {det.producto.nombre}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-foreground text-sm">
                          {formatCOP(v.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
