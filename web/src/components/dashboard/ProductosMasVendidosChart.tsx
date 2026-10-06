import ReactApexChart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

interface Props {
  data: { id: number; producto: string; cantidad: number }[];
}

const COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
];

export default function ProductosMasVendidosChart({ data }: Props) {
  const top = data.slice(0, 5);
  const categorias = top.map((p) =>
    p.producto.length > 22 ? p.producto.slice(0, 22) + "…" : p.producto
  );
  const cantidades = top.map((p) => p.cantidad);

  const options: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter Variable, sans-serif",
      animations: { enabled: true, easing: "easeinout", speed: 600 },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        distributed: true,
        barHeight: "60%",
      },
    },
    colors: COLORS,
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val} uds.`,
      style: { fontSize: "11px", fontWeight: "600", colors: ["#fff"] },
    },
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
        style: { colors: "#94a3b8", fontSize: "12px", fontWeight: "500" },
      },
    },
    grid: {
      borderColor: "rgba(148,163,184,0.1)",
      strokeDashArray: 4,
      yaxis: { lines: { show: false } },
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (val) => `${val} unidades` },
    },
    legend: { show: false },
  };

  const series = [{ name: "Volumen Vendido", data: cantidades }];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[280px] text-center gap-2">
        <span className="text-3xl">🛍️</span>
        <p className="text-sm font-semibold text-foreground">Sin unidades distribuidas</p>
        <p className="text-xs text-muted-foreground">No se registran salidas de mercancía durante el mes en curso.</p>
      </div>
    );
  }

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="bar"
      height={280}
    />
  );
}
