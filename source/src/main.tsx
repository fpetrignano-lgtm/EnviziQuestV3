import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Scale the 1080px layout to fill the browser viewport.
// Uses screen.height (physical monitor height) — constant, unaffected by browser Cmd+/- zoom.
function applyScale() {
  const scale = screen.height / 1080;
  const root = document.getElementById("root") as HTMLElement;
  root.style.transform = `scale(${scale})`;
  root.style.transformOrigin = "top left";
  root.style.width = `${(1 / scale) * 100}vw`;
  root.style.height = "1080px";
  root.style.overflow = "hidden";
}
applyScale();

// Copy on click — missionProgress badge (navbar)
document.addEventListener("click", (e) => {
  const el = (e.target as HTMLElement).closest(".missionProgress");
  if (!el) return;
  const text = el.textContent?.replace(/^\s*·?\s*/, "").trim() ?? "";
  navigator.clipboard.writeText(text).then(() => {
    el.setAttribute("data-copied", "1");
    setTimeout(() => el.removeAttribute("data-copied"), 1400);
  });
});

// Copy on click — pageNum badge (bottom-left slide identifier)
document.addEventListener("click", (e) => {
  const el = (e.target as HTMLElement).closest("#envizi-page-num");
  if (!el) return;
  const text = el.textContent?.trim() ?? "";
  navigator.clipboard.writeText(text).then(() => {
    el.setAttribute("data-copied", "1");
    setTimeout(() => el.removeAttribute("data-copied"), 1400);
  });
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
