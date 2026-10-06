import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileCode, FileText } from "lucide-react";
import { downloadCSV, downloadExcel, printPDFReport } from "@/utils/exportUtils";

interface ExportDropdownProps {
  title: string;
  filename: string;
  headers: string[];
  rows: (string | number | boolean | null | undefined)[][];
  disabled?: boolean;
}

export function ExportDropdown({
  title,
  filename,
  headers,
  rows,
  disabled = false,
}: ExportDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleExportCSV = () => {
    setOpen(false);
    downloadCSV(filename, headers, rows);
  };

  const handleExportExcel = () => {
    setOpen(false);
    downloadExcel(filename, headers, rows);
  };

  const handleExportPDF = () => {
    setOpen(false);
    printPDFReport(title, headers, rows);
  };

  const isDisabled = disabled || rows.length === 0;

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 select-none
          ${
            isDisabled
              ? "opacity-40 cursor-not-allowed bg-muted border border-border text-muted-foreground"
              : open
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
              : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
          }
        `}
      >
        <Download className="h-3.5 w-3.5" />
        <span>Exportar</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !isDisabled && (
        <div className="absolute right-0 top-full mt-1.5 w-48 z-50 bg-card border border-border rounded-xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Formato de descarga
          </div>

          <button
            type="button"
            onClick={handleExportExcel}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
            <span>Excel (.xlsx / .csv)</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileCode className="h-3.5 w-3.5 text-blue-500" />
            <span>CSV (.csv)</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-foreground hover:bg-accent transition-colors text-left"
          >
            <FileText className="h-3.5 w-3.5 text-rose-500" />
            <span>PDF (.pdf)</span>
          </button>
        </div>
      )}
    </div>
  );
}
