import { type RouteConfig, route } from "@react-router/dev/routes";
// import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

// export default remixRoutesOptionAdapter((defineRoutes) => {
//     return defineRoutes((route) => {
//         // route("/*", "routes/main.tsx", { index: true, id: "main" });
//         // route("/", "routes/main.tsx", { id: "main-root" });
//         route("~~~dummy", "routes/main.tsx", { id: "dummy" });
//       });
// }) satisfies RouteConfig;

// import {
//   type RouteConfig,
//   route,
//   layout,
//   index,
//   prefix,
// } from "@react-router/dev/routes";

export default [
  route("*", "routes/main.tsx", { index: true, id: "main" }),
] satisfies RouteConfig;