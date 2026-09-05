import { createPortal } from "react-dom";
import type { ReactNode } from "react";

/**
 * Monta i figli su document.body, fuori dal #root trasformato con scale().
 * Il wrapper position:fixed 100vw×100vh garantisce che il contenuto sia sempre
 * relativo al viewport reale, non al contenitore scalato.
 */
export function Portal({ children }: { children: ReactNode }) {
  return createPortal(
    <div style={{
      position: "fixed",
      inset: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
      pointerEvents: "none",
    }}>
      <div style={{ pointerEvents: "auto", width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>,
    document.body
  );
}
