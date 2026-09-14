import type { Project as ProjectRecord } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

/** Projects owned by `userId`, newest first. */
export function listOwnedProjects(userId: string): Promise<ProjectRecord[]> {
  return prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Projects shared with the user through a collaborator row matching `email`,
 * newest first. Projects the user owns are excluded so none appears in both
 * lists. A user without an email address has no shared projects.
 */
export async function listSharedProjects(
  userId: string,
  email: string | null,
): Promise<ProjectRecord[]> {
  if (!email) {
    return [];
  }

  return prisma.project.findMany({
    where: {
      ownerId: { not: userId },
      collaborators: {
        some: { email: { equals: email, mode: "insensitive" } },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Reduces a database record to what the editor UI renders. The room ID is the
 * project ID — see `lib/room-id.ts`.
 */
export function toProjectSummary(
  record: Pick<ProjectRecord, "id" | "name">,
): Project {
  return { id: record.id, name: record.name, roomId: record.id };
}
