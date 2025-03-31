import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { useParams } from '@remix-run/react';
import { ProfilePage } from "~/components/pages/profile"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: params.profile + " - Profile Liked Casts" },
    { name: "description", content: params.profile + "- Viewing Profile Liked Casts" },
  ];
 
};

export default function Profile() {
    const params = useParams();
    const profile = params.profile;
    const feed = 'likes';

 
  return (
    <Shell>
      <ProfilePage profile={profile ?? ''} startFeed={feed} />
    </Shell>
  );
}
