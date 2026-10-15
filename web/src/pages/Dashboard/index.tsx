import { useState } from "react";
import {
  TrendingUp,
  FileText,
  BarChart3,
  AlertTriangle,
  Calendar,
  ShoppingBag,
  Wallet,
  LucideIcon,
} from "lucide-react";
import { useDashboard } from "@/hooks/useDashboard";
import { calcularRango, RangoFechas, RangoPeriodo } from "@/services/dashboard.service";
import DateRangeSelector from "@/components/dashboard/DateRangeSelector";
import VentasPorDiaChart from "@/components/dashboard/VentasPorDiaChart";
import ProductosMasVendidosChart from "@/components/dashboard/ProductosMasVendidosChart";
import StockCriticoTable from "@/components/dashboard/StockCriticoTable";
import ActividadReciente from "@/components/dashboard/ActividadReciente";
import InsightsIA from "@/components/dashboard/InsightsIA";
import { formatCOP } from "@/utils/formatCOP";

// ─── KPI Card ──────────────────────────────────────────────────────────────────

interface KPICardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  subtext?: string;
  valueClassName?: string;
}

function KPICard({ label, value, icon: Icon, color, bg, subtext, valueClassName }: KPICardProps) {
  return (
    <div className="group bg-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 border border-border/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-border transition-all duration-200 cursor-default h-full min-h-[92px] relative overflow-hidden">
      {/* Sutil halo al hacer hover */}
      <div
        className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none -mr-6 -mt-6 ${bg}`}
      />

      {/* Ícono a la izquierda */}
      <div
        className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl shrink-0 ${bg} transition-transform duration-200 group-hover:scale-105 shadow-2xs`}
      >
        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
      </div>

      {/* Contenido a la derecha */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground tracking-tight truncate" title={label}>
          {label}
        </p>
        <p className={`text-lg sm:text-xl font-bold font-mono text-foreground leading-tight tracking-tight tabular-nums mt-0.5 ${valueClassName || ""}`}>
          {value}
        </p>
        {subtext && (
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight truncate" title={subtext}>
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Card wrapper ────────────────────────────────────────────────────

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

function DashCard({ title, subtitle, children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col gap-4 ${className}`}
    >
      <div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

// ─── KPI Skeleton ──────────────────────────────────────────────────────────────

function KPISkeleton() {
  return (
    <div className="bg-card rounded-2xl p-3.5 sm:p-4 flex items-center gap-3.5 border border-border/80 shadow-xs h-full min-h-[92px]">
      <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-muted animate-pulse shrink-0" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
        <div className="h-2.5 w-28 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function ChartSkeleton({ height = "h-52" }: { height?: string }) {
  return (
    <div
      className={`w-full ${height} rounded-lg bg-muted animate-pulse`}
    />
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

// ── Subtítulo dinámico según período ────────────────────────────────────────
function formatSubtitulo(rango: RangoFechas): string {
  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
    d.toLocaleDateString("es-CO", opts);

  switch (rango.periodo) {
    case "hoy":
      return fmt(rango.inicio, { weekday: "long", day: "numeric", month: "long" });
    case "semana": {
      const ini = fmt(rango.inicio, { day: "numeric" });
      const fin = fmt(rango.fin,   { day: "numeric", month: "long", year: "numeric" });
      return `Semana del ${ini} al ${fin}`;
    }
    case "mes":
      return fmt(rango.inicio, { month: "long", year: "numeric" });
    case "anio": {
      const ini = fmt(rango.inicio, { month: "long" });
      const fin = fmt(rango.fin,   { month: "long", year: "numeric" });
      return `${ini} – ${fin}`;
    }
    case "personalizado": {
      const ini = fmt(rango.inicio, { day: "numeric", month: "short" });
      const fin = fmt(rango.fin,   { day: "numeric", month: "short", year: "numeric" });
      return `${ini} – ${fin}`;
    }
  }
}

const LABELS_PERIODO: Record<RangoPeriodo, string> = {
  hoy: "de hoy",
  semana: "semanal",
  mes: "del mes",
  anio: "del año",
  personalizado: "del período",
};

export default function DashboardPage() {
  const [rango, setRango] = useState<RangoFechas>(() => calcularRango("mes"));
  const { data, isLoading } = useDashboard(rango);

  const kpis = data?.kpis;
  const subtitulo = formatSubtitulo(rango);
  const labelPeriodo = LABELS_PERIODO[rango.periodo];

  return (
    <div className="space-y-6">
      {/* ── Encabezado premium ───────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-3">
          {/* Barra de acento vertical */}
          <div className="w-1 self-stretch rounded-full bg-gradient-to-b from-primary via-primary/60 to-transparent mt-0.5 shrink-0" />

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Dashboard General
              </h1>
              {data && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5 animate-fade-in">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En vivo
                </span>
              )}
            </div>

            {/* Subtítulo como pill con ícono de calendario */}
            <div className="inline-flex items-center gap-1.5 bg-muted/60 border border-border rounded-lg px-2.5 py-1">
              <Calendar className="h-3 w-3 text-muted-foreground shrink-0" />
              <span className="text-xs font-medium text-muted-foreground capitalize">{subtitulo}</span>
            </div>
          </div>
        </div>

        {/* Selector de rango */}
        <div className="flex items-center gap-3 mt-0.5">
          <DateRangeSelector
            value={rango.periodo}
            onChange={setRango}
          />
        </div>
      </div>

      {/* ── KPIs (5 Cards Dinámicas y Estilizadas) ───────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {isLoading ? (
          <>
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
            <KPISkeleton />
          </>
        ) : (
          <>
            <KPICard
              label="Ventas"
              value={formatCOP(kpis?.ventas ?? 0)}
              icon={TrendingUp}
              color="text-emerald-500"
              bg="bg-emerald-500/10"
              subtext={rango.periodo === "hoy" ? "Facturación de hoy" : `Facturación ${labelPeriodo}`}
            />
            <KPICard
              label="Compras"
              value={formatCOP(kpis?.compras ?? 0)}
              icon={ShoppingBag}
              color="text-rose-500"
              bg="bg-rose-500/10"
              subtext={rango.periodo === "hoy" ? "Adquisiciones de hoy" : `Adquisiciones ${labelPeriodo}`}
            />
            <KPICard
              label="Ganancias"
              value={formatCOP(kpis?.ganancias ?? 0)}
              icon={Wallet}
              color={(kpis?.ganancias ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"}
              bg={(kpis?.ganancias ?? 0) >= 0 ? "bg-emerald-500/10" : "bg-rose-500/10"}
              subtext={rango.periodo === "hoy" ? "Margen neto de hoy" : `Margen neto ${labelPeriodo}`}
              valueClassName={(kpis?.ganancias ?? 0) < 0 ? "text-rose-600 dark:text-rose-400" : ""}
            />
            <KPICard
              label="Transacciones"
              value={String(kpis?.transacciones ?? kpis?.facturasHoy ?? 0)}
              icon={FileText}
              color="text-violet-500"
              bg="bg-violet-500/10"
              subtext={`${kpis?.ventasCount ?? 0} ventas • ${kpis?.comprasCount ?? 0} compras`}
            />
            <KPICard
              label="Stock Crítico"
              value={String(kpis?.stockBajo ?? 0)}
              icon={AlertTriangle}
              color={(kpis?.stockBajo ?? 0) > 0 ? "text-amber-500" : "text-emerald-500"}
              bg={(kpis?.stockBajo ?? 0) > 0 ? "bg-amber-500/10" : "bg-emerald-500/10"}
              subtext="Por abastecer"
              valueClassName={(kpis?.stockBajo ?? 0) > 0 ? "text-amber-600 dark:text-amber-400" : ""}
            />
          </>
        )}
      </div>

      {/* ── Gráficos ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Ventas por día — ocupa 3 de 5 columnas */}
        <DashCard
          title="Historial de Facturación Diaria"
          subtitle={`Evolución de ventas ${labelPeriodo}`}
          className="xl:col-span-3"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <VentasPorDiaChart data={data?.ventasPorDia ?? []} />
          )}
        </DashCard>

        {/* Productos más vendidos — ocupa 2 de 5 columnas */}
        <DashCard
          title="Rendimiento de Productos"
          subtitle={`Top 5 artículos con mayor demanda ${labelPeriodo}`}
          className="xl:col-span-2"
        >
          {isLoading ? (
            <ChartSkeleton />
          ) : (
            <ProductosMasVendidosChart data={data?.productosMasVendidos ?? []} />
          )}
        </DashCard>
      </div>

      {/* ── Parte inferior ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock crítico */}
        <DashCard
          title="Control de Disponibilidad de Producto"
          subtitle="Artículos que requieren reposición urgente"
        >
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <StockCriticoTable data={data?.stockCritico ?? []} />
          )}
        </DashCard>

        {/* Actividad reciente */}
        <DashCard
          title="Bitácora de Operaciones"
          subtitle="Auditoría de eventos recientes del sistema"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-11 w-11 rounded-full bg-muted animate-pulse shrink-0" />
                  <div className="flex-1 space-y-1.5 pt-1">
                    <div className="h-3 w-3/4 rounded-full bg-muted animate-pulse" />
                    <div className="h-2.5 w-1/2 rounded-full bg-muted animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActividadReciente data={data?.actividadReciente ?? []} />
          )}
        </DashCard>

        {/* IA Insights */}
        <InsightsIA />
      </div>
    </div>
  );
}
