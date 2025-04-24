import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// {
//   ssr: false,
//   future: {
//     v3_fetcherPersist: true,
//     v3_relativeSplatPath: true,
//     v3_throwAbortReason: true,
//   },
//   routes(defineRoutes) {
//     return defineRoutes((route) => {
//       route("*", "routes/main.tsx", { index: true, id: "main" });
//       route("/", "routes/main.tsx", { id: "main-root" });
//     });
//   },
// }

export default defineConfig({
  plugins: [
    reactRouter(),
    tsconfigPaths(),
  ],
  server: {
    proxy: {
      "/api": {
        bypass: (req) => {
          return req.url;
        },
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    }
  }
});