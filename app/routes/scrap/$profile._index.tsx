import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { useParams } from '@remix-run/react';
import { ProfilePage } from "~/components/pages/profile"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: "Farcaster " + params.profile },
    { name: "description", content: "Viewing profile " },
  ];
 
};

export default function Profile() {
    const params = useParams();
    const profile = params.profile;

  return (
    <Shell>
      <ProfilePage profile={profile ?? ''} />
    </Shell>
    // <div className="font-sans p-4">
    //   <h1 className="text-3xl">Welcome to Remix (SPA Mode)</h1>
    //   <ul className="list-disc mt-4 pl-6 space-y-2">
    //     <li>
    //       <a
    //         className="text-blue-700 underline visited:text-purple-900"
    //         target="_blank"
    //         href="https://remix.run/guides/spa-mode"
    //         rel="noreferrer"
    //       >
    //         SPA Mode Guide
    //       </a>
    //     </li>
    //     <li>
    //       <a
    //         className="text-blue-700 underline visited:text-purple-900"
    //         target="_blank"
    //         href="https://remix.run/docs"
    //         rel="noreferrer"
    //       >
    //         Remix Docs
    //       </a>
    //     </li>
    //   </ul>
    // </div>
  );
}
