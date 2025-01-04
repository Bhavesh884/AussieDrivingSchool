import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Make sure it's accessible from outside
    port: 3000,
    strictPort: true,
  },
});
