import type { MetaFunction } from "@remix-run/node";
import { Shell } from "~/components/template/shell"
import { BookmarkPages } from "~/components/pages/bookmarks"

export const meta: MetaFunction = ({ params }) => {
   
  return [
    { title: params.profile + " - Profile Liked Casts" },
    { name: "description", content: params.profile + "- Viewing Profile Liked Casts" },
  ];
 
};

export default function Profile() {

  return (
    <Shell>
      <BookmarkPages />
    </Shell>
  );
}
