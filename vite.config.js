import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf-8"));

export default defineConfig({
  base: "/mental-kungfu/",
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_NUMBER__: JSON.stringify(process.env.BUILD_NUMBER || "dev"),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: parseInt(process.env.PORT || "3000"),
  },
});
