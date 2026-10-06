import { useState } from "react";
import { Package, Ban, AlertCircle, Loader2 } from "lucide-react";
import { CompraAPI } from "@/services/compras.service";
import { useAnularCompra } from "@/hooks/useCompras";

interface Props {
  compra: CompraAPI;
  onVerDetalle: (c: CompraAPI) => void;
}

export default function CompraActions({ compra, onVerDetalle }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const anularMutation = useAnularCompra();

  const handleAnular = async () => {
    setErrorMsg("");
    try {
      await anularMutation.mutateAsync(compra.id);
      setShowConfirm(false);
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMsg(error.response.data.message);
      } else {
        setErrorMsg("Hubo un error al anular la compra");
      }
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 justify-center">
        <button
          onClick={() => onVerDetalle(compra)}
          className="whitespace-nowrap inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-muted/60 hover:bg-primary hover:text-primary-foreground text-muted-foreground border border-border/60 hover:border-primary transition-all duration-150"
          title="Ver detalle de la compra"
        >
          <Package className="h-3 w-3 shrink-0" />
          Ver Detalle
        </button>

        {compra.activo && (
          <button
            onClick={() => setShowConfirm(true)}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white border border-transparent hover:border-rose-600 transition-all duration-150"
            title="Anular compra"
          >
            <Ban className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-card rounded-2xl border border-border/80 shadow-2xl p-5 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500 border border-rose-500/20">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">¿Anular esta compra?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              La compra se marcará como anulada, pero no afectará el inventario actual.
            </p>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setShowConfirm(false); setErrorMsg(""); }}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-foreground transition-colors"
                disabled={anularMutation.isPending}
              >
                Cancelar
              </button>
              <button
                onClick={handleAnular}
                disabled={anularMutation.isPending}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {anularMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Sí, Anular"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
