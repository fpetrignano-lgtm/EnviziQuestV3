import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { reportRefreshPlugin } from "./vite-plugin-report-refresh";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/EnviziQuestV3/" : "/",
  plugins: [react(), reportRefreshPlugin()],
  build: { chunkSizeWarningLimit: 700 },
}));
