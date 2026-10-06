interface StockItem {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
}

interface Props {
  data: StockItem[];
}

export default function StockCriticoTable({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
        <span className="text-3xl">🛡️</span>
        <p className="text-sm font-semibold text-foreground">Inventario en niveles óptimos</p>
        <p className="text-xs text-muted-foreground">No se registran alertas de abastecimiento crítico.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const isAgotado = item.stock === 0;
        return (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-4 rounded-xl border bg-card transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md cursor-default ${
              isAgotado
                ? "border-red-500/25 bg-red-500/[0.02] hover:bg-red-500/[0.04]"
                : "border-amber-500/25 bg-amber-500/[0.02] hover:bg-amber-500/[0.04]"
            }`}
          >
            {/* Indicador de estado circular premium (Pulsante para agotado) */}
            <div className="relative flex h-3 w-3 shrink-0">
              {isAgotado ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
              )}
            </div>

            {/* Datos del producto */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.nombre}
              </p>
              <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                Cód: {item.codigo}
              </p>
            </div>

            {/* Contador de Stock */}
            <div className="shrink-0 text-right">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isAgotado
                    ? "bg-red-500/10 text-red-500 border-red-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}
              >
                Stock: {item.stock}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
