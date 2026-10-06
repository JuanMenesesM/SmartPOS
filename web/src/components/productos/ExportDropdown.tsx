import { Download, FileSpreadsheet, FileCode } from "lucide-react";
import { Producto } from "@/types/producto";
import { exportarProductosCSV } from "@/services/productos.service";

interface Props {
  productos: Producto[];
  disabled: boolean;
}

export default function ExportDropdown({ productos, disabled }: Props) {
  const handleExportExcel = () => {
    exportarProductosCSV(productos);
  };

  const handleExportCSV = () => {
    exportarProductosCSV(productos);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleExportExcel}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold
          transition-all duration-200 select-none
          ${disabled
            ? "opacity-40 cursor-not-allowed bg-card border-border text-foreground"
            : "bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-sm"
          }
        `}
      >
        <FileSpreadsheet className="h-3.5 w-3.5" />
        <span>Excel</span>
      </button>

      <button
        onClick={handleExportCSV}
        disabled={disabled}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold
          transition-all duration-200 select-none
          ${disabled
            ? "opacity-40 cursor-not-allowed bg-card border-border text-foreground"
            : "bg-blue-500 text-white border-transparent hover:bg-blue-600 shadow-sm"
          }
        `}
      >
        <FileCode className="h-3.5 w-3.5" />
        <span>CSV</span>
      </button>
    </div>
  );
}
