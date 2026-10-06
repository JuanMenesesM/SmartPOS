import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import { formatCOP, formatCOPCompact } from "@/utils/formatCOP";

interface Props {
  data: { fecha: string; total: number }[];
}

function formatearFecha(fechaIso: string): string {
  const [, mes, dia] = fechaIso.split("-");
  return `${dia}/${mes}`;
}

export default function VentasPorDiaChart({ data }: Props) {
  const categorias = data.map((d) => formatearFecha(d.fecha));
  const totales = data.map((d) => d.total);

  const options: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      sparkline: { enabled: false },
      background: "transparent",
      fontFamily: "Inter Variable, sans-serif",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 600,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 100],
      },
    },
    colors: ["#6366F1"],
    xaxis: {
      categories: categorias,
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px" },
        formatter: (val) => formatCOPCompact(val),
      },
    },
    grid: {
      borderColor: "rgba(148,163,184,0.1)",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (val) => formatCOP(val),
      },
    },
    markers: {
      size: 4,
      colors: ["#6366F1"],
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
  };

  const series = [{ name: "Ingresos Diarios", data: totales }];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center gap-2">
        <span className="text-3xl">📈</span>
        <p className="text-sm font-semibold text-foreground">Sin transacciones registradas</p>
        <p className="text-xs text-muted-foreground">No se han detectado operaciones de venta en el período actual.</p>
      </div>
    );
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={280}
    />
  );
}
