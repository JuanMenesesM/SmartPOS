interface ActividadItem {
  fecha: string;
  usuario: string;
  descripcion: string;
}

interface Props {
  data: ActividadItem[];
}

function getDotColor(descripcion: string) {
  const d = descripcion.toLowerCase();
  if (d.includes("venta")) return "bg-purple-500 ring-purple-500/20";
  if (d.includes("compra")) return "bg-blue-500 ring-blue-500/20";
  if (d.includes("producto") || d.includes("actuali")) return "bg-amber-500 ring-amber-500/20";
  return "bg-emerald-500 ring-emerald-500/20";
}

function formatearHora(fechaIso: string): string {
  try {
    const d = new Date(fechaIso);
    return d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "--:--";
  }
}

export default function ActividadReciente({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
        <span className="text-3xl">📋</span>
        <p className="text-sm font-semibold text-foreground">Sin registros de actividad</p>
        <p className="text-xs text-muted-foreground">No se detectaron eventos o modificaciones recientes.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6">
      {/* Línea vertical del Timeline */}
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-border" />

      <div className="space-y-5">
        {data.map((item, i) => {
          const dotColor = getDotColor(item.descripcion);
          const hora = formatearHora(item.fecha);

          return (
            <div key={i} className="relative group">
              {/* Círculo indicador */}
              <div
                className={`absolute -left-[24px] top-1.5 h-3.5 w-3.5 rounded-full ring-4 ${dotColor} transition-transform duration-200 group-hover:scale-125 z-10`}
              />

              <div className="space-y-1">
                {/* Fila superior: Hora + Título del Evento */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary font-mono bg-primary/5 px-2 py-0.5 rounded">
                    {hora}
                  </span>
                  <p className="text-sm font-semibold text-foreground truncate flex-1">
                    {item.descripcion}
                  </p>
                </div>

                {/* Fila inferior: Usuario */}
                <p className="text-xs text-muted-foreground pl-1">
                  Realizado por: <span className="font-medium text-foreground/80">{item.usuario}</span>
                </p>
              </div>

              {/* Separador inferior excepto en el último */}
              {i < data.length - 1 && (
                <div className="border-b border-border mt-4 w-full opacity-60" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
