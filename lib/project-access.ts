import { auth, currentUser } from "@clerk/nextjs/server";

import {
  Prisma,
  type Project as ProjectRecord,
} from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Clerk user ID of the signed-in caller, or `null` when there is no session.
 * This ID is what `Project.ownerId` stores.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export interface CurrentIdentity {
  userId: string;
  /** Primary email address — what collaborator rows are matched against. */
  email: string | null;
}

/** The signed-in caller's user ID and primary email, or `null` when signed out. */
export async function getCurrentIdentity(): Promise<CurrentIdentity | null> {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const primaryEmail = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId,
  );

  return { userId: user.id, email: primaryEmail?.emailAddress ?? null };
}

export type ProjectRole = "owner" | "collaborator";

export interface ProjectAccess {
  project: ProjectRecord;
  /** How the caller reaches the project. Owners take precedence. */
  role: ProjectRole;
}

/**
 * The project with ID `projectId` together with the caller's role on it, or
 * `null` when the caller is neither its owner nor a collaborator. A project
 * that does not exist is also `null`, so callers cannot tell the two apart —
 * which keeps project IDs from being probed.
 *
 * Collaborator emails are matched case-insensitively, as in
 * `listSharedProjects`, so a user sees the same projects in the sidebar that
 * they can open.
 */
export async function getProjectAccess(
  projectId: string,
  identity: CurrentIdentity,
): Promise<ProjectAccess | null> {
  const { userId, email } = identity;

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        ...(email
          ? [
              {
                collaborators: {
                  some: { email: { equals: email, mode: "insensitive" as const } },
                },
              },
            ]
          : []),
      ],
    },
  });

  if (!project) {
    return null;
  }

  return {
    project,
    role: project.ownerId === userId ? "owner" : "collaborator",
  };
}

export type ProjectOwnership = "owner" | "forbidden" | "not-found";

/**
 * Decides whether `userId` may mutate the project. Only the owner may;
 * collaborators and everyone else are `forbidden`.
 */
export async function checkProjectOwnership(
  projectId: string,
  userId: string,
): Promise<ProjectOwnership> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return "not-found";
  }

  return project.ownerId === userId ? "owner" : "forbidden";
}

/**
 * True when a Prisma write matched no record — for example, a project deleted
 * between the ownership check and the mutation.
 */
export function isRecordNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}

/** True when a Prisma write collided with a unique constraint, such as an ID. */
export function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}
