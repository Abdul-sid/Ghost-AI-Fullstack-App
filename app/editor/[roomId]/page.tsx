import { auth } from "@clerk/nextjs/server";

import { AccessDenied } from "@/components/editor/access-denied";
import { EditorWorkspace } from "@/components/editor/editor-workspace";
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access";
import {
  listOwnedProjects,
  listSharedProjects,
  toProjectSummary,
} from "@/lib/project-data";

/**
 * A project workspace. Access is checked on the server before anything
 * renders: signed-out callers go to sign-in, and callers who are neither the
 * owner nor a collaborator — or ask for a project that does not exist — get
 * `AccessDenied`.
 */
export default async function EditorWorkspacePage({
  params,
}: PageProps<"/editor/[roomId]">) {
  const [{ roomId }, identity] = await Promise.all([
    params,
    getCurrentIdentity(),
  ]);

  if (!identity) {
    const { redirectToSignIn } = await auth();
    return redirectToSignIn();
  }

  const access = await getProjectAccess(roomId, identity);

  if (!access) {
    return <AccessDenied />;
  }

  const [ownedProjects, sharedProjects] = await Promise.all([
    listOwnedProjects(identity.userId),
    listSharedProjects(identity.userId, identity.email),
  ]);

  return (
    <EditorWorkspace
      project={toProjectSummary(access.project)}
      role={access.role}
      ownedProjects={ownedProjects.map(toProjectSummary)}
      sharedProjects={sharedProjects.map(toProjectSummary)}
    />
  );
}
