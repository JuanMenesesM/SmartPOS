import { useState } from "react";
import { Truck, X, Loader2, Save, Building2, Phone, Mail, MapPin, Hash, Sparkles } from "lucide-react";
import ModalPortal from "@/components/ui/ModalPortal";
import { useCrearProveedor } from "@/hooks/useCompras";
import { Proveedor } from "@/services/compras.service";

/** Formatea un NIT colombiano mientras el usuario escribe.
 *  Acepta dígitos y guion, produce: 900.123.456-7  */
function formatNIT(raw: string): string {
  // Separa parte numérica y dígito verificador
  const [main, dv] = raw.split("-");
  const digits = main.replace(/\D/g, "");
  // Agrega puntos cada 3 dígitos desde la derecha
  const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dv !== undefined ? `${formatted}-${dv.replace(/\D/g, "")}` : formatted;
}

interface ProveedorModalProps {
  onClose: () => void;
  onSuccess?: (nuevoProveedor: Proveedor) => void;
}

export default function ProveedorModal({ onClose, onSuccess }: ProveedorModalProps) {
  const [nombre, setNombre] = useState("");
  const [nit, setNit] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");

  const crearProveedorMutation = useCrearProveedor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) {
      setError("Por favor ingresa el nombre del distribuidor.");
      return;
    }

    try {
      const res = await crearProveedorMutation.mutateAsync({
        nombre: nombre.trim(),
        nit: nit.replace(/\./g, "").trim() || undefined,  // guarda sin puntos
        telefono: telefono.trim() || undefined,
        correo: correo.trim() || undefined,
        direccion: direccion.trim() || undefined,
      });

      if (onSuccess && res.proveedor) {
        onSuccess(res.proveedor);
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Ocurrió un error al registrar el distribuidor");
    }
  };

  return (
    <ModalPortal>
      {/* Overlay blur pantalla completa */}
      <div
        className="fixed inset-0 z-[9998] bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Contenedor de posicionamiento perfectamente centrado en pantalla */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto pointer-events-none">
        {/* Halo ambiental suave detrás de la tarjeta */}
        <div className="absolute w-96 h-96 rounded-full filter blur-[100px] opacity-30 bg-emerald-500 pointer-events-none -z-10" />

        <div className="w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative flex flex-col pointer-events-auto my-auto">
          {/* Barra de acento con gradiente */}
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-primary to-teal-500 shrink-0" />

          {/* Cabecera Pro Ampliada */}
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 ring-1 ring-emerald-500/20 shadow-sm">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-foreground leading-tight flex items-center gap-1.5">
                  <span>Nuevo Distribuidor</span>
                  <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                </h2>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  Registra un proveedor para gestionar tus abastecimientos
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

          {/* Formulario Pro con proporciones amplias */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs font-semibold rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 animate-in fade-in">
                {error}
              </div>
            )}

            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Nombre del Distribuidor *</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Distribuidora Textil S.A.S."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                required
                autoFocus
              />
            </div>

            {/* Grid NIT y Teléfono */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>NIT / Cédula</span>
                </label>
                <input
                  type="text"
                  value={nit}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setNit(formatNIT(raw));
                  }}
                  placeholder="900.123.456-7"
                  maxLength={14}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Teléfono / Celular</span>
                </label>
                <input
                  type="text"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="300 123 4567"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm font-mono rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Correo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Correo Electrónico</span>
              </label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="contacto@distribuidor.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Dirección */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Dirección de Ubicación</span>
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Calle 100 # 15-20, Medellín"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            {/* Botones Acciones */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-border mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-xl text-muted-foreground hover:bg-accent transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={crearProveedorMutation.isPending}
                className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 transition-all duration-150 disabled:opacity-50 flex items-center gap-2"
              >
                {crearProveedorMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Guardar Distribuidor</span>
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
