import { useState } from "react";
import ModalPortal from "@/components/ui/ModalPortal";
import {
  X,
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Loader2,
  Sparkles,
  Save,
  Check,
} from "lucide-react";
import { crearUsuario, CreateUsuarioPayload } from "@/services/usuarios.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLES = [
  { id: 1, label: "Administrador", desc: "Acceso total a configuración y reportes" },
  { id: 2, label: "Cajero", desc: "Gestión de ventas y cobros en punto de venta" },
];

export default function UsuarioModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState<CreateUsuarioPayload>({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    rolId: 2,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim()) {
      setErrorMsg("Por favor completa los campos obligatorios.");
      return;
    }

    if (formData.contrasena.length < 4) {
      setErrorMsg("La contraseña debe tener al menos 4 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      await crearUsuario(formData);
      setFormData({
        nombre: "",
        apellido: "",
        correo: "",
        contrasena: "",
        rolId: 2,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err?.response?.data?.message || "Error al crear el usuario. Verifica los datos."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
      {/* Overlay idéntico al de Kardex */}
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal centrado */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col pointer-events-auto max-h-[92vh]">
          {/* Barra de acento superior */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-violet-500 to-blue-500 shrink-0" />

          {/* Cabecera */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20 shadow-sm">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight flex items-center gap-1.5">
                  Nuevo Usuario
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                </h2>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Registra un usuario para acceder al sistema
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-border/60"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-in fade-in duration-150">
                  {errorMsg}
                </div>
              )}

              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3 w-3 text-primary" /> Nombre
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej. Carlos"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3 w-3 text-primary" /> Apellido
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                    placeholder="Ej. Pérez"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Correo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={formData.correo}
                  onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                  placeholder="carlos@empresa.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              {/* Contraseña */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-primary" /> Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.contrasena}
                    onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                    placeholder="Mínimo 4 caracteres"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-muted/30 border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Selector de Rol: Administrador y Cajero */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-primary" /> Rol en el Sistema
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {ROLES.map((rol) => {
                    const isSelected = formData.rolId === rol.id;
                    return (
                      <button
                        key={rol.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, rolId: rol.id })}
                        className={`p-3 rounded-2xl border text-left transition-all duration-200 relative flex flex-col justify-between ${
                          isSelected
                            ? "bg-primary/10 border-primary shadow-sm ring-1 ring-primary/20"
                            : "bg-muted/20 border-border hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span
                            className={`text-xs font-bold ${
                              isSelected ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {rol.label}
                          </span>
                          {isSelected && (
                            <div className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {rol.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/60 flex items-center justify-end gap-3 bg-muted/10 shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-xs shadow-md shadow-primary/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    Guardar Usuario
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
