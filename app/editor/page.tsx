import { auth } from "@clerk/nextjs/server";

import { EditorHome } from "@/components/editor/editor-home";
import { getCurrentIdentity } from "@/lib/project-access";
import {
  listOwnedProjects,
  listSharedProjects,
  toProjectSummary,
} from "@/lib/project-data";

/**
 * Editor home. Fetches the signed-in user's owned and shared projects on the
 * server and hands both lists to the client shell — no client-side fetch on
 * initial load. Mutations re-run this component through `router.refresh()`.
 */
export default async function EditorPage() {
  const identity = await getCurrentIdentity();

  if (!identity) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    listOwnedProjects(identity.userId),
    listSharedProjects(identity.userId, identity.email),
  ]);

  return (
    <EditorHome
      ownedProjects={ownedProjects.map(toProjectSummary)}
      sharedProjects={sharedProjects.map(toProjectSummary)}
    />
  );
}
