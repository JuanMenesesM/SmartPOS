import { createPortal } from "react-dom";
import { ReactNode } from "react";

/**
 * Renderiza los hijos directamente en document.body usando React Portal.
 * Esto garantiza que los overlays fixed cubran el 100% del viewport
 * sin importar el contexto CSS de los ancestros (overflow, transform, etc.).
 */
export default function ModalPortal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
