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
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const menuHeight = 175;
      const menuWidth = 192; // 12rem / w-48

      // Determine whether to show above or below based on viewport
      const showAbove = rect.bottom + menuHeight > window.innerHeight && rect.top > menuHeight;
      const top = showAbove ? rect.top - menuHeight : rect.bottom + 4;
      const left = Math.max(10, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 10));

      setCoords({ top, left });
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() {
      if (open) setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        ref={btnRef}
        type="button"
        onClick={handleToggle}
        className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors active:scale-95"
        title="Opciones del producto"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div
          ref={menuRef}
          style={{ top: `${coords.top}px`, left: `${coords.left}px` }}
          className="fixed z-[99999] w-48 bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            type="button"
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
            type="button"
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
            type="button"
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
            type="button"
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
