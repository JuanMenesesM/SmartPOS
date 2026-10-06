import { useState } from "react";
import {
  Settings,
  Users,
  Shield,
  Palette,
  Sun,
  Moon,
  Monitor,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { actualizarUsuario, crearUsuario } from "@/services/usuarios.service";
import { Plus, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type TabId = "general" | "usuarios" | "seguridad";

interface Tab {
  id: TabId;
  label: string;
  icon: typeof Settings;
}

const TABS: Tab[] = [
  { id: "general",   label: "General",   icon: Palette },
  { id: "usuarios",  label: "Usuarios",  icon: Users },
  { id: "seguridad", label: "Seguridad", icon: Shield },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getCurrentUserId(): number {
  try {
    const raw = localStorage.getItem("usuario");
    if (raw) return JSON.parse(raw).id;
  } catch {}
  return 0;
}

function getRolLabel(rolId: number): string {
  switch (rolId) {
    case 1: return "Administrador";
    case 2: return "Cajero";
    case 3: return "Bodeguero";
    default: return `Rol ${rolId}`;
  }
}

// ── General Tab ───────────────────────────────────────────────────────────────

function GeneralTab() {
  const [tema, setTema] = useState<"light" | "dark">(() => {
    if (document.documentElement.classList.contains("dark")) return "dark";
    return "light";
  });

  const temas = [
    { id: "light"  as const, label: "Claro",    icon: Sun,     desc: "Interfaz con fondos claros" },
    { id: "dark"   as const, label: "Oscuro",   icon: Moon,    desc: "Ideal para ambientes con poca luz" },
  ];

  function handleTemaChange(newTema: "light" | "dark") {
    setTema(newTema);
    if (newTema === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  return (
    <div className="space-y-6">
      {/* Tema */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Apariencia</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Selecciona el tema visual de la aplicación.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {temas.map((t) => {
            const Icon = t.icon;
            const isActive = tema === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTemaChange(t.id)}
                className={`group relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all duration-200 ${
                  isActive
                    ? "border-primary/40 bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-card hover:border-primary/20 hover:bg-accent/50"
                }`}
              >
                {isActive && (
                  <div className="absolute top-2.5 right-2.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                    {t.label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {t.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Usuarios Tab ──────────────────────────────────────────────────────────────

function UsuariosTab() {
  const { data: usuarios = [], isLoading, refetch } = useUsuarios();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    rolId: 2,
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await crearUsuario(formData);
      setIsModalOpen(false);
      setFormData({ nombre: "", apellido: "", correo: "", contrasena: "", rolId: 2 });
      refetch();
    } catch (error) {
      console.error(error);
      alert("Error al crear usuario");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground">Cargando usuarios…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground">Usuarios del Sistema</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""} registrado{usuarios.length !== 1 ? "s" : ""}
          </p>
        </div>
        
        {(() => {
          try {
            const u = JSON.parse(localStorage.getItem("usuario") || "{}");
            if (u.rolId === 1) {
              return (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all select-none"
                >
                  <Plus className="h-4 w-4" />
                  <span>Nuevo Usuario</span>
                </button>
              );
            }
          } catch {}
          return null;
        })()}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Usuario
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Correo
                </th>
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Rol
                </th>
                <th className="text-center px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((u) => (
                <tr
                  key={u.id}
                  className="hover:bg-accent/40 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 shrink-0 shadow-sm">
                        <span className="text-xs font-bold text-white">
                          {u.nombre.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {u.nombre} {u.apellido}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">{u.correo}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                      {getRolLabel(u.rolId)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold border ${
                        u.activo
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          u.activo ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-muted-foreground"
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-foreground">Nuevo Usuario</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Nombre</label>
                  <input required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm" placeholder="Ej. Carlos" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Apellido</label>
                  <input required value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm" placeholder="Ej. Pérez" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Correo Electrónico</label>
                <input type="email" required value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm" placeholder="carlos@empresa.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Empresa Asignada</label>
                <div className="w-full px-3 py-2 rounded-xl bg-muted/80 border border-border text-sm text-muted-foreground font-semibold cursor-not-allowed flex items-center bg-muted">
                  Empresa Actual (Bloqueado)
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Contraseña</label>
                <input type="password" required value={formData.contrasena} onChange={e => setFormData({...formData, contrasena: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm" placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Rol</label>
                <select value={formData.rolId} onChange={e => setFormData({...formData, rolId: Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-sm outline-none">
                  <option value={1}>Administrador</option>
                  <option value={2}>Cajero</option>
                  <option value={3}>Bodeguero</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                  {isSubmitting ? "Creando..." : "Crear Usuario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Seguridad Tab ─────────────────────────────────────────────────────────────

function SeguridadTab() {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);

    if (newPass.length < 4) {
      setResult({ type: "error", msg: "La contraseña debe tener al menos 4 caracteres." });
      return;
    }
    if (newPass !== confirmPass) {
      setResult({ type: "error", msg: "Las contraseñas no coinciden." });
      return;
    }

    const userId = getCurrentUserId();
    if (!userId) {
      setResult({ type: "error", msg: "No se pudo identificar el usuario actual." });
      return;
    }

    setIsLoading(true);
    try {
      await actualizarUsuario(userId, { contrasena: newPass });
      setResult({ type: "success", msg: "Contraseña actualizada correctamente." });
      setNewPass("");
      setConfirmPass("");
    } catch (err: any) {
      setResult({
        type: "error",
        msg: err?.response?.data?.message || "Error al actualizar la contraseña.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cambiar contraseña */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Cambiar Contraseña</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Actualiza la contraseña de tu cuenta.
          </p>
        </div>

        {result && (
          <div
            className={`flex items-start gap-2.5 rounded-xl border p-3.5 ${
              result.type === "success"
                ? "border-emerald-500/20 bg-emerald-500/8"
                : "border-red-500/20 bg-red-500/8"
            }`}
          >
            {result.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm leading-relaxed ${
                result.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-400"
              }`}
            >
              {result.msg}
            </p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {/* Nueva contraseña */}
          <div className="space-y-1.5">
            <label
              htmlFor="new-pass"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
              <input
                id="new-pass"
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-muted/30 pl-11 pr-12 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm-pass"
              className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 pointer-events-none" />
              <input
                id="confirm-pass"
                type={showConfirm ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-muted/30 pl-11 pr-12 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary/40"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !newPass || !confirmPass}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all duration-200 hover:shadow-md hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando…
              </>
            ) : (
              "Actualizar Contraseña"
            )}
          </button>
        </form>
      </div>

      {/* Info de sesión */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <h3 className="text-sm font-bold text-foreground">Sesión Actual</h3>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 shadow-sm">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {(() => {
                try {
                  const u = JSON.parse(localStorage.getItem("usuario") || "{}");
                  return `${u.nombre || ""} ${u.apellido || ""}`.trim() || "Usuario";
                } catch {
                  return "Usuario";
                }
              })()}
            </p>
            <p className="text-xs text-muted-foreground">
              {(() => {
                try {
                  return JSON.parse(localStorage.getItem("usuario") || "{}").correo || "";
                } catch {
                  return "";
                }
              })()}
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Conectado
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Configuración
          </h1>
          <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
            <Settings className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-xs font-medium text-muted-foreground">
              Preferencias del sistema, usuarios y seguridad.
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-xl bg-muted/40 border border-border p-1 w-fit">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ────────────────────────────────────────────────────── */}
      {activeTab === "general" && <GeneralTab />}
      {activeTab === "usuarios" && <UsuariosTab />}
      {activeTab === "seguridad" && <SeguridadTab />}
    </div>
  );
}
