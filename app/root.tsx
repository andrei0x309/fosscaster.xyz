import { Links, Meta, Scripts,  } from "react-router";
import "./tailwind.css";
import '~/assets/global.css'
import '@radix-ui/themes/styles.css';
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";
import { Toaster } from "~/components/ui/toaster"
import Index  from "./routes/main";


export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut ico" href="/favicon.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="dark:bg-neutral-950 bg-white">
      <div id="app" className="mx-auto">
        {children}
        </div>
        <Toaster />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Index  />;
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
