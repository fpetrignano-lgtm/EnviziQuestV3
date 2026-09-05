import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Monta i figli direttamente su document.body, fuori dal #root trasformato con scale().
 * Nessun wrapper aggiuntivo: i figli usano position:fixed propri e puntano al viewport reale.
 */
export function Portal({ children }: { children: ReactNode }) {
  return createPortal(children, document.body);
}
