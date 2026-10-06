import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  Building2,
  FileText,
  Phone,
  Mail,
  MapPin,
  Globe2,
  Receipt,
  Save,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Empresa, EmpresaConfiguracion } from "@/types/empresa";
import { getEmpresa, updateEmpresa, createEmpresa } from "@/services/empresa.service";

interface FormData extends Omit<Empresa, "id" | "activo" | "configuracion"> {
  configuracion: EmpresaConfiguracion;
}

const DEFAULT_CONFIG: EmpresaConfiguracion = {
  moneda: "COP",
  simboloMoneda: "$",
  zonaHoraria: "America/Bogota",
  formatoFecha: "DD/MM/YYYY",
  formatoHora: "12h",
  prefijoFacturas: "POS-",
  numeroInicialFacturas: "1",
  mensajePieFactura: "¡Gracias por su compra! Vuelva pronto.",
  mostrarLogoFactura: true,
  mostrarDireccionFactura: true,
  mostrarTelefonoFactura: true,
  iva: "IVA",
  porcentajeIva: "0",
  aplicarImpuestos: false,
  stockMinimoDefecto: "5",
  permitirStockNegativo: false,
  alertarStockBajo: true,
  abrirVentaAutomaticamente: true,
  imprimirFacturaAutomaticamente: true,
  solicitarConfirmacionCobro: true,
};

export default function EmpresaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<FormData>();

  const watchedNombre = watch("nombre");
  const watchedNit = watch("nit");
  const watchedTelefono = watch("telefono");
  const watchedDireccion = watch("direccion");
  const watchedCiudad = watch("ciudad");
  const watchedPrefijo = watch("configuracion.prefijoFacturas") || "POS-";
  const watchedPie = watch("configuracion.mensajePieFactura");
  const watchedMostrarDir = watch("configuracion.mostrarDireccionFactura");
  const watchedMostrarTel = watch("configuracion.mostrarTelefonoFactura");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmpresa();
        setEmpresaId(data.id);
        const config = data.configuracion || DEFAULT_CONFIG;

        reset({
          nombre: data.nombre || "",
          nit: data.nit || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          correo: data.correo || "",
          logo: data.logo || "",
          ciudad: data.ciudad || "",
          configuracion: { ...DEFAULT_CONFIG, ...(typeof config === "object" ? config : {}) },
        });
      } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 500) {
          reset({
            nombre: "",
            nit: "",
            direccion: "",
            telefono: "",
            correo: "",
            logo: "",
            ciudad: "",
            configuracion: DEFAULT_CONFIG,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (empresaId) {
        await updateEmpresa(empresaId, data);
        toast.success("Información de empresa actualizada");
      } else {
        const nueva = await createEmpresa(data);
        setEmpresaId(nueva.id);
        toast.success("Empresa configurada exitosamente");
      }
    } catch (error) {
      toast.error("Error al guardar la información de la empresa");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-xs text-muted-foreground font-semibold">
            Cargando datos de la empresa...
          </span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* ── Encabezado ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
              Empresa y Facturación
              <Sparkles className="h-5 w-5 text-primary" />
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Datos comerciales y de contacto que aparecerán en las facturas y comprobantes.
              </span>
            </div>
          </div>
        </div>

        {/* Botón Guardar Superior */}
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar Cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Columna Izquierda: Formulario Principal (2 cols) ────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Datos del Negocio */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ring-1 ring-primary/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Datos del Negocio</h2>
                <p className="text-xs text-muted-foreground">
                  Información fiscal e identificación comercial
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nombre de la Empresa */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-primary" /> Nombre / Razón Social
                </label>
                <input
                  required
                  {...register("nombre")}
                  placeholder="Ej. Mi Tienda Principal S.A.S."
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-semibold"
                />
              </div>

              {/* NIT */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-primary" /> NIT / Documento Tributario
                </label>
                <input
                  required
                  {...register("nit")}
                  placeholder="Ej. 900.123.456-7"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-mono font-medium"
                />
              </div>

              {/* Teléfono */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-primary" /> Teléfono / WhatsApp
                </label>
                <input
                  {...register("telefono")}
                  placeholder="Ej. +57 300 123 4567"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              {/* Correo */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-primary" /> Correo Electrónico
                </label>
                <input
                  type="email"
                  {...register("correo")}
                  placeholder="contacto@mitienda.com"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              {/* Dirección */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-primary" /> Dirección Comercial
                </label>
                <input
                  {...register("direccion")}
                  placeholder="Ej. Carrera 15 # 45-20"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>

              {/* Ciudad */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Globe2 className="h-3 w-3 text-primary" /> Ciudad / Municipio
                </label>
                <input
                  {...register("ciudad")}
                  placeholder="Ej. Bogotá, D.C."
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Configuración del Comprobante / Factura */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-border/60">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 ring-1 ring-violet-500/20">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Detalles del Comprobante</h2>
                <p className="text-xs text-muted-foreground">
                  Textos y opciones que se imprimen en el ticket
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Prefijo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-violet-500" /> Prefijo de Factura
                </label>
                <input
                  {...register("configuracion.prefijoFacturas")}
                  placeholder="Ej. POS-"
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all font-mono font-bold"
                />
              </div>

              {/* Mensaje Pie de Factura */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Receipt className="h-3 w-3 text-violet-500" /> Mensaje en Pie de Factura
                </label>
                <textarea
                  rows={2}
                  {...register("configuracion.mensajePieFactura")}
                  placeholder="Ej. ¡Gracias por su compra! Vuelva pronto."
                  className="w-full bg-muted/30 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:bg-background focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none font-medium"
                />
              </div>

              {/* Opciones visuales del ticket */}
              <div className="sm:col-span-2 pt-2 space-y-2.5">
                <label className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("configuracion.mostrarDireccionFactura")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-border"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-foreground block">
                      Incluir dirección en el ticket
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Imprime la dirección y ciudad en el encabezado de la factura.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer select-none">
                  <input
                    type="checkbox"
                    {...register("configuracion.mostrarTelefonoFactura")}
                    className="w-4 h-4 rounded text-primary focus:ring-primary/30 border-border"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-foreground block">
                      Incluir teléfono en el ticket
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Imprime el número telefónico para contacto del cliente.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* ── Columna Derecha: Vista Previa del Ticket (1 col) ────────────────────── */}
        <div className="space-y-4">
          <div className="sticky top-6">
            <div className="bg-card border border-border rounded-3xl p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Receipt className="h-3.5 w-3.5 text-primary" /> Vista Previa del Ticket
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Formato POS
                </span>
              </div>

              {/* Simulación del Ticket */}
              <div className="bg-muted/40 border border-dashed border-border/80 rounded-2xl p-4 font-mono text-[11px] text-foreground space-y-3 shadow-inner">
                {/* Cabecera Ticket */}
                <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-border">
                  <p className="font-extrabold text-xs text-foreground uppercase truncate">
                    {watchedNombre || "NOMBRE DE LA EMPRESA"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    NIT: {watchedNit || "000.000.000-0"}
                  </p>
                  {watchedMostrarDir && (
                    <p className="text-[10px] text-muted-foreground truncate">
                      {watchedDireccion || "Dirección Comercial"}
                      {watchedCiudad ? ` - ${watchedCiudad}` : ""}
                    </p>
                  )}
                  {watchedMostrarTel && (
                    <p className="text-[10px] text-muted-foreground">
                      Tel: {watchedTelefono || "(300) 000-0000"}
                    </p>
                  )}
                </div>

                {/* Info Factura */}
                <div className="text-[10px] space-y-0.5 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Factura:</span>
                    <span className="font-bold text-foreground">{watchedPrefijo}0001</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha:</span>
                    <span>{new Date().toLocaleDateString("es-CO")}</span>
                  </div>
                </div>

                {/* Línea Items Muestra */}
                <div className="border-t border-b border-dashed border-border py-1.5 space-y-1 text-[10px]">
                  <div className="flex justify-between">
                    <span className="truncate max-w-[140px]">1 × Producto Muestra</span>
                    <span className="font-semibold">$15.000</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-xs pt-1 border-t border-border/40 text-foreground">
                    <span>TOTAL:</span>
                    <span>$15.000</span>
                  </div>
                </div>

                {/* Pie de ticket */}
                <div className="text-center pt-1 text-[10px] text-muted-foreground italic">
                  <p>{watchedPie || "¡Gracias por su compra!"}</p>
                </div>
              </div>

              {/* Botón Guardar Inferior */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/25 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
