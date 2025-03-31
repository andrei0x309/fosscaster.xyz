import type { MetaFunction } from "@remix-run/node";
import { Main } from "~/components/pages/main";
import { Shell } from "~/components/template/shell";

export const meta: MetaFunction = () => {
  return [
    { title: "FC App - Warpcast SPA clone - Trending Feed" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];

};

export default function Index() {
  return (
    <Shell>
      <Main key={1} initialFeed="all-channels" />
    </Shell>
  );
}
