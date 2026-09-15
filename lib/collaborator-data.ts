import type { ProjectCollaborator as CollaboratorRecord } from "@/app/generated/prisma/client";
import { getClerkProfilesByEmail } from "@/lib/clerk-profiles";
import { normalizeEmail } from "@/lib/collaborator-input";
import { prisma } from "@/lib/prisma";
import type { Collaborator } from "@/types/collaborator";

/** Collaborator rows of a project, oldest invite first. */
export function listCollaboratorRecords(
  projectId: string,
): Promise<CollaboratorRecord[]> {
  return prisma.projectCollaborator.findMany({
    where: { projectId },
    orderBy: { createdAt: "asc" },
  });
}

/**
 * The collaborator row for `email` on a project, matched case-insensitively so
 * rows written before emails were normalized still count as duplicates.
 */
export function findCollaboratorByEmail(
  projectId: string,
  email: string,
): Promise<CollaboratorRecord | null> {
  return prisma.projectCollaborator.findFirst({
    where: { projectId, email: { equals: email, mode: "insensitive" } },
  });
}

/**
 * Attaches Clerk names and avatars to collaborator rows. Rows whose email has
 * no Clerk user keep `name` and `avatarUrl` as `null`, so the UI shows the
 * email alone.
 */
export async function withClerkProfiles(
  records: Pick<CollaboratorRecord, "id" | "email">[],
): Promise<Collaborator[]> {
  const profiles = await getClerkProfilesByEmail(
    records.map((record) => record.email),
  );

  return records.map((record) => {
    const profile = profiles.get(normalizeEmail(record.email));

    return {
      id: record.id,
      email: record.email,
      name: profile?.name ?? null,
      avatarUrl: profile?.avatarUrl ?? null,
    };
  });
}
