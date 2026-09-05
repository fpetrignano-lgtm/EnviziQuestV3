// Vite plugin: espone POST /api/refresh-report
// Riceve { pptxBase64: string } — salva il PPTX, lo converte in PDF con soffice,
// poi in PNG con pdftoppm, sovrascrive public/report-slide-*.png
// Risponde { ok: true, count: N } oppure { ok: false, error: string }

import type { Plugin } from "vite";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import type { IncomingMessage, ServerResponse } from "http";

export function reportRefreshPlugin(): Plugin {
  // Risolve il root del progetto una volta sola alla configurazione del plugin
  let projectRoot = process.cwd();

  return {
    name: "report-refresh",
    configResolved(config) {
      projectRoot = config.root;
    },
    configureServer(server) {
      server.middlewares.use("/api/refresh-report", (req: IncomingMessage, res: ServerResponse) => {
        // CORS permissivo per dev locale
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
        if (req.method !== "POST") { res.statusCode = 405; res.end("Method Not Allowed"); return; }

        const chunks: Buffer[] = [];
        req.on("data", (chunk: Buffer) => { chunks.push(chunk); });
        req.on("end", () => {
          try {
            const { pptxBase64 } = JSON.parse(Buffer.concat(chunks).toString()) as { pptxBase64: string };
            if (!pptxBase64) throw new Error("pptxBase64 missing");

            // Usa os.tmpdir() per evitare problemi di permessi con node_modules
            const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "report-refresh-"));
            const pptxPath = path.join(tmpDir, "report.pptx");
            // soffice nomina il PDF come il file input — report.pptx → report.pdf
            const pdfPath  = path.join(tmpDir, "report.pdf");
            const pngBase  = path.join(tmpDir, "slide");
            const publicDir = path.join(projectRoot, "public");

            console.log("[report-refresh] tmpDir:", tmpDir);
            console.log("[report-refresh] publicDir:", publicDir);

            // Scrivi PPTX
            fs.writeFileSync(pptxPath, Buffer.from(pptxBase64, "base64"));
            console.log("[report-refresh] PPTX scritto:", fs.statSync(pptxPath).size, "bytes");

            // Converti in PDF con soffice
            // --norestore evita dialog di crash recovery che bloccano l'headless
            execSync(
              `soffice --headless --norestore --convert-to pdf --outdir "${tmpDir}" "${pptxPath}"`,
              { timeout: 60000, stdio: "pipe" }
            );

            if (!fs.existsSync(pdfPath)) throw new Error(`PDF non trovato dopo soffice: ${pdfPath}`);
            console.log("[report-refresh] PDF generato:", fs.statSync(pdfPath).size, "bytes");

            // Converti PDF in PNG con pdftoppm
            execSync(`pdftoppm -r 144 -png "${pdfPath}" "${pngBase}"`, { timeout: 30000, stdio: "pipe" });

            // Trova i PNG generati (pdftoppm genera slide-1.png, slide-2.png, ...)
            const pngs = fs.readdirSync(tmpDir)
              .filter(f => f.startsWith("slide") && f.endsWith(".png"))
              .sort((a, b) => {
                // sort numerico: slide-1 < slide-2 < slide-10
                const na = parseInt(a.replace(/\D/g, ""), 10);
                const nb = parseInt(b.replace(/\D/g, ""), 10);
                return na - nb;
              });

            if (pngs.length === 0) throw new Error("Nessun PNG generato da pdftoppm");
            console.log("[report-refresh] PNG generati:", pngs.length);

            pngs.forEach((f, i) => {
              const src = path.join(tmpDir, f);
              const dst = path.join(publicDir, `report-slide-${i + 1}.png`);
              fs.copyFileSync(src, dst);
            });

            // Pulizia directory temporanea
            fs.rmSync(tmpDir, { recursive: true, force: true });

            res.setHeader("Content-Type", "application/json");
            res.statusCode = 200;
            res.end(JSON.stringify({ ok: true, count: pngs.length }));
          } catch (err: any) {
            console.error("[report-refresh] ERRORE:", err?.message || err);
            res.setHeader("Content-Type", "application/json");
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: String(err?.message || err) }));
          }
        });
      });
    },
  };
}
