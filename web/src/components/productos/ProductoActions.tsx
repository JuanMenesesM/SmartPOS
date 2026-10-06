import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit3, Copy, Eye, Power } from "lucide-react";
import { Producto } from "@/types/producto";

interface Props {
  producto: Producto;
  onEditar: (p: Producto) => void;
  onDuplicar: (p: Producto) => void;
  onVerKardex: (p: Producto) => void;
  onToggleEstado: (p: Producto) => void;
}

export default function ProductoActions({
  producto,
  onEditar,
  onDuplicar,
  onVerKardex,
  onToggleEstado,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        title="Opciones del producto"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 z-50 bg-card border border-border rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => {
              setOpen(false);
              onEditar(producto);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <Edit3 className="h-3.5 w-3.5 text-blue-500" />
            Editar
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onDuplicar(producto);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <Copy className="h-3.5 w-3.5 text-violet-500" />
            Duplicar
          </button>

          <button
            onClick={() => {
              setOpen(false);
              onVerKardex(producto);
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl text-foreground hover:bg-accent transition-colors text-left"
          >
            <Eye className="h-3.5 w-3.5 text-emerald-500" />
            Ver Kardex
          </button>

          <div className="h-px bg-border my-1" />

          <button
            onClick={() => {
              setOpen(false);
              onToggleEstado(producto);
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl transition-colors text-left ${
              producto.activo
                ? "text-amber-600 hover:bg-amber-500/10"
                : "text-emerald-600 hover:bg-emerald-500/10"
            }`}
          >
            <Power className="h-3.5 w-3.5" />
            {producto.activo ? "Inactivar" : "Activar"}
          </button>
        </div>
      )}
    </div>
  );
}
