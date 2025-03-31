import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { useParams } from '@remix-run/react';
import { ProfilePage } from "~/components/pages/profile"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: params.profile + " - Profile followed channels" },
    { name: "description", content: params.profile + "- Viewing Profile followed channels" },
  ];
 
};

export default function Profile() {
    const params = useParams();
    const profile = params.profile;
    const feed = 'channels';

 
  return (
    <Shell>
      <ProfilePage profile={profile ?? ''} startFeed={feed} />
    </Shell>
  );
}
