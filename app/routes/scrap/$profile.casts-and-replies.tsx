import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { useParams } from '@remix-run/react';
import { ProfilePage } from "~/components/pages/profile"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: params.profile + " - Profile Casts and Replies" },
    { name: "description", content: params.profile + "- Viewing Profile Casts and Replies" },
  ];
 
};

export default function Profile() {
    const params = useParams();
    const profile = params.profile;
    const feed = 'casts-and-replies';

 
  return (
    <Shell>
      <ProfilePage profile={profile ?? ''} startFeed={feed} />
    </Shell>
  );
}
