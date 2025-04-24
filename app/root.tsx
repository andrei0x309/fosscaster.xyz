import "./tailwind.css";
import '~/assets/global.css'
import '@radix-ui/themes/styles.css';
import { Links, Scripts,  } from "react-router";
import { HydrateFallback } from "~/components/atomic/hydratation-fallback";
import { Toaster } from "~/components/ui/toaster"
import Index from "./routes/main";
import { generateURLFCFrameEmbed } from '~/lib/mini-app'
import { Helmet } from "react-helmet";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="shortcut ico" href="/favicon.png" />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="fc:frame" content={generateURLFCFrameEmbed(
          {
            url: 'https://fosscaster.xyz',
            featureImage: "https://fosscaster.xyz/hotlink-ok/og/default.webp"
          }
        )} />
      <Helmet>
      <title>Fosscaster.xyz</title>
      <meta name="description" content="Fosscaster.xyz" />
      <meta property="og:title" content="Fosscaster.xyz" />
      <meta property="og:description" content="Fosscaster.xyz" />
      <meta property="og:image" content="https://fosscaster.xyz/hotlink-ok/og/default.webp" />
      <meta property="og:url" content="https://fosscaster.xyz" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Fosscaster.xyz" />
      <meta name="twitter:description" content="Fosscaster.xyz" />
      <meta name="twitter:image" content="https://fosscaster.xyz/hotlink-ok/og/default.webp" />
      </Helmet>
 
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

export { HydrateFallback }
