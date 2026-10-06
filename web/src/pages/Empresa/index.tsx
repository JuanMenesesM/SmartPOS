import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  Building2, Globe2, FileText, Percent, Package, 
  ShoppingCart, Database, Monitor, Save, X,
  ChevronDown, Check
} from "lucide-react";

import { Empresa, EmpresaConfiguracion } from "@/types/empresa";
import { getEmpresa, updateEmpresa, createEmpresa } from "@/services/empresa.service";

type SettingsSection = 
  | "general" | "comercial" | "facturacion" 
  | "impuestos" | "inventario" | "ventas" 
  | "respaldos" | "sistema";

interface FormData extends Omit<Empresa, 'id' | 'activo' | 'configuracion'> {
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
  mensajePieFactura: "¡Gracias por su compra!",
  mostrarLogoFactura: true,
  mostrarDireccionFactura: true,
  mostrarTelefonoFactura: true,
  iva: "IVA",
  porcentajeIva: "19",
  aplicarImpuestos: false,
  stockMinimoDefecto: "5",
  permitirStockNegativo: false,
  alertarStockBajo: true,
  abrirVentaAutomaticamente: true,
  imprimirFacturaAutomaticamente: true,
  solicitarConfirmacionCobro: true,
};

// ── Componente Select Personalizado Estilo Compras ───────────────────────────────
interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  placeholder?: string;
  title: string;
}

function CustomSelect({ value, onChange, options, placeholder = "Seleccione...", title }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl border text-sm font-semibold
          transition-all duration-200 select-none
          ${open || value
            ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
            : "bg-background text-foreground border-border hover:bg-accent hover:border-border/80 shadow-sm"
          }
        `}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180 text-primary" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-full z-50 bg-card border border-border rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 pt-3 pb-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
          </div>
          <div className="p-1.5 space-y-0.5 max-h-52 overflow-y-auto custom-scrollbar">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl text-left
                    transition-colors duration-150
                    ${isSelected ? "bg-primary text-primary-foreground font-semibold" : "hover:bg-accent text-foreground"}
                  `}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Página de Empresa principal ──────────────────────────────────────────────────
export default function EmpresaPage() {
  const [activeTab, setActiveTab] = useState<SettingsSection>("general");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [empresaId, setEmpresaId] = useState<number | null>(null);
  const [ultimoRespaldo, setUltimoRespaldo] = useState<string>("Nunca");

  const { register, handleSubmit, control, reset } = useForm<FormData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEmpresa();
        setEmpresaId(data.id);
        const config = data.configuracion || DEFAULT_CONFIG;
        
        reset({
          nombre: data.nombre,
          nit: data.nit || "",
          direccion: data.direccion || "",
          telefono: data.telefono || "",
          correo: data.correo || "",
          logo: data.logo || "",
          ciudad: data.ciudad || "",
          configuracion: { ...DEFAULT_CONFIG, ...(typeof config === 'object' ? config : {}) }
        });
      } catch (error: any) {
        if (error.response?.status === 404 || error.response?.status === 500) {
          // Si no existe la empresa, resetear a valores por defecto
          reset({
            nombre: "",
            nit: "",
            direccion: "",
            telefono: "",
            correo: "",
            logo: "",
            ciudad: "",
            configuracion: DEFAULT_CONFIG
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
        toast.success("Configuraciones guardadas");
      } else {
        const nueva = await createEmpresa(data);
        setEmpresaId(nueva.id);
        toast.success("Empresa creada y configuraciones guardadas");
      }
    } catch (error) {
      toast.error("Error al guardar las configuraciones");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerarRespaldo = () => {
    const data = {
      empresa: "SmartPOS",
      fecha: new Date().toISOString(),
      version: "1.0.0",
      mensaje: "Respaldo de prueba generado",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `respaldo_smartpos_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    const fechaFormat = new Date().toLocaleString("es-CO");
    setUltimoRespaldo(fechaFormat);
    toast.success("Respaldo descargado correctamente");
  };

  const SidebarItem = ({ icon: Icon, label, id }: { icon: any, label: string, id: SettingsSection }) => (
    <button
      type="button"
      onClick={() => setActiveTab(id)}
      className={`
        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold
        ${activeTab === id 
          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }
      `}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-[calc(100vh-120px)] flex flex-col">
      
      {/* ── Encabezado Limpio y Cohesivo ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-start gap-3">
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Empresa
            </h1>
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Building2 className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground">
                Configuración general del negocio.
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
          <SidebarItem icon={Building2} label="1. Información General" id="general" />
          <SidebarItem icon={Globe2} label="2. Información Comercial" id="comercial" />
          <SidebarItem icon={FileText} label="3. Facturación" id="facturacion" />
          <SidebarItem icon={Percent} label="4. Impuestos (Futuro)" id="impuestos" />
          <SidebarItem icon={Package} label="5. Inventario" id="inventario" />
          <SidebarItem icon={ShoppingCart} label="6. Ventas" id="ventas" />
          <SidebarItem icon={Database} label="7. Respaldos (Futuro)" id="respaldos" />
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            
            {/* 1. General */}
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">1. Información General</h2>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><Building2 className="h-3 w-3" /> Nombre de la empresa</label>
                    <input {...register("nombre")} className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Ej. Mi Tienda Principal" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><FileText className="h-3 w-3" /> NIT</label>
                    <input {...register("nit")} className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium font-mono" placeholder="Ej. 900.123.456-7" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><FileText className="h-3 w-3" /> Razón Social</label>
                    <input className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Igual al nombre si se deja vacío" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><Globe2 className="h-3 w-3" /> Correo</label>
                    <input {...register("correo")} type="email" className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Ej. contacto@mitienda.com" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><FileText className="h-3 w-3" /> Teléfono</label>
                    <input {...register("telefono")} className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Ej. 3001234567" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><Globe2 className="h-3 w-3" /> Dirección</label>
                    <input {...register("direccion")} className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Ej. Calle Principal 123" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-1.5"><Globe2 className="h-3 w-3" /> Ciudad</label>
                    <input {...register("ciudad")} className="w-full bg-background border border-border/80 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10 transition-all shadow-sm placeholder:text-muted-foreground/50 text-foreground font-medium" placeholder="Ej. Bogotá" />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Comercial */}
            {activeTab === "comercial" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">2. Información Comercial</h2>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Moneda</label>
                    <Controller
                      control={control}
                      name="configuracion.moneda"
                      render={({ field: { value, onChange } }) => (
                        <CustomSelect
                          value={value}
                          onChange={onChange}
                          title="Moneda"
                          options={[
                            { value: "COP", label: "Peso Colombiano (COP)" },
                            { value: "USD", label: "Dólar Estadounidense (USD)" },
                            { value: "EUR", label: "Euro (EUR)" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Símbolo</label>
                    <input {...register("configuracion.simboloMoneda")} className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Zona Horaria</label>
                    <Controller
                      control={control}
                      name="configuracion.zonaHoraria"
                      render={({ field: { value, onChange } }) => (
                        <CustomSelect
                          value={value}
                          onChange={onChange}
                          title="Zona Horaria"
                          options={[
                            { value: "America/Bogota", label: "America/Bogota (GMT-5)" },
                          ]}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Formato de Fecha</label>
                    <Controller
                      control={control}
                      name="configuracion.formatoFecha"
                      render={({ field: { value, onChange } }) => (
                        <CustomSelect
                          value={value}
                          onChange={onChange}
                          title="Formato de Fecha"
                          options={[
                            { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                            { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                            { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                          ]}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Facturacion */}
            {activeTab === "facturacion" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">3. Facturación</h2>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Prefijo Facturas</label>
                    <input {...register("configuracion.prefijoFacturas")} className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Número Inicial</label>
                    <input {...register("configuracion.numeroInicialFacturas")} className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Mensaje Pie de Factura</label>
                    <textarea {...register("configuracion.mensajePieFactura")} rows={3} className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none" />
                  </div>
                  
                  <div className="col-span-2 space-y-3 pt-4 border-t border-border/50">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("configuracion.mostrarLogoFactura")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-xs font-semibold">Mostrar Logo en factura</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("configuracion.mostrarDireccionFactura")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-xs font-semibold">Mostrar Dirección en factura</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("configuracion.mostrarTelefonoFactura")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-xs font-semibold">Mostrar Teléfono en factura</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Impuestos */}
            {activeTab === "impuestos" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">4. Impuestos (Futuro)</h2>
                <div className="grid grid-cols-2 gap-5 opacity-70 pointer-events-none">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Nombre de Impuesto</label>
                    <input defaultValue="IVA" className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Porcentaje (%)</label>
                    <input defaultValue="19" className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none transition-all" />
                  </div>
                  <div className="col-span-2 pt-2">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-3 block">¿Aplicar impuestos?</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="imp" className="text-primary" />
                        <span className="text-sm font-semibold">Sí</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="imp" defaultChecked className="text-primary" />
                        <span className="text-sm font-semibold">No</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Inventario */}
            {activeTab === "inventario" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">5. Inventario</h2>
                <div className="grid gap-6">
                  <div className="space-y-1.5 max-w-xs">
                    <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Stock mínimo por defecto</label>
                    <input {...register("configuracion.stockMinimoDefecto")} type="number" className="w-full bg-muted/40 border border-border rounded-xl px-3.5 py-2 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" />
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-border/50">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("configuracion.permitirStockNegativo")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold block">Permitir stock negativo</span>
                        <span className="text-[11px] text-muted-foreground block leading-tight">Permite vender productos aunque no haya existencias en el sistema.</span>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" {...register("configuracion.alertarStockBajo")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                      <span className="text-xs font-semibold block">Alertar stock bajo</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Ventas */}
            {activeTab === "ventas" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">6. Ventas</h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30">
                    <input type="checkbox" {...register("configuracion.abrirVentaAutomaticamente")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-xs font-semibold">Abrir venta automáticamente</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30">
                    <input type="checkbox" {...register("configuracion.imprimirFacturaAutomaticamente")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-xs font-semibold">Imprimir factura después de cobrar</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-border bg-muted/30">
                    <input type="checkbox" {...register("configuracion.solicitarConfirmacionCobro")} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                    <span className="text-xs font-semibold">Solicitar confirmación antes de cobrar</span>
                  </label>
                </div>
              </div>
            )}

            {/* 7. Respaldos */}
            {activeTab === "respaldos" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-lg font-bold">7. Respaldos (Futuro)</h2>
                <div className="p-5 rounded-2xl border border-border bg-muted/20 space-y-4">
                  <p className="text-xs text-muted-foreground">Último respaldo: <strong>{ultimoRespaldo}</strong></p>
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      onClick={handleGenerarRespaldo}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                    >
                      Generar respaldo
                    </button>
                    <button type="button" className="px-4 py-2 rounded-xl border border-border font-semibold text-xs opacity-70 cursor-not-allowed">
                      Restaurar respaldo
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Flotante */}
          <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
            <button 
              type="button" 
              onClick={() => {
                // Cancelar: recargar data original
                window.location.reload();
              }}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted font-semibold text-xs transition-all duration-150 flex items-center gap-2"
            >
              <X className="h-4 w-4" /> Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs transition-all duration-150 flex items-center gap-2 shadow-md shadow-primary/20 disabled:opacity-70"
            >
              <Save className="h-4 w-4" /> 
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
