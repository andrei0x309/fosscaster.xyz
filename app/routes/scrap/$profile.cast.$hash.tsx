import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { useParams } from '@remix-run/react';
import { ProfilePage } from "~/components/pages/profile"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: "Cast " + params.hash },
    { name: "description", content: "Viewing Cast " + params.hash },
  ];
 
};

export default function Profile() {
    const params = useParams();
    const profile = params.profile;
    const hash = params.hash;

 
  return (
    <Shell>
      <ProfilePage profile={profile ?? ''} hash={hash} />
    </Shell>
  );
}
