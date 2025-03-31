import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import '~/assets/global.css'
import '@radix-ui/themes/styles.css';
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut ico" href="/favicon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body suppressHydrationWarning={true}>
      <div id="app" className="mx-auto bg-white dark:bg-neutral-950">
        {children}
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet  />;
}

// width: 45px;
// height: 40px;
// background: linear-gradient(#0000 calc(1*100%/6),#fff 0 calc(3*100%/6),#0000 0),
//           linear-gradient(#0000 calc(2*100%/6),#fff 0 calc(4*100%/6),#0000 0),
//           linear-gradient(#0000 calc(3*100%/6),#fff 0 calc(5*100%/6),#0000 0);
// background-size: 10px 400%;
// background-repeat: no-repeat;
// animation: matrix 1s infinite linear;

export { HydrateFallback }
