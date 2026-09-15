import { clerkClient } from "@clerk/nextjs/server";

import { normalizeEmail } from "@/lib/collaborator-input";

export interface ClerkProfile {
  name: string | null;
  avatarUrl: string;
}

/** Clerk's `getUserList` accepts at most this many email addresses per call. */
const EMAILS_PER_REQUEST = 100;

/**
 * Looks up Clerk users by email through the Clerk Backend API and returns
 * their display name and avatar, keyed by normalized email.
 *
 * A user is matched on their primary email only — the address
 * `getProjectAccess` grants access by — so a profile is shown for exactly the
 * person the collaborator row lets in. Emails with no matching user are
 * absent from the map. If Clerk cannot be reached the map is empty, since
 * profiles are decoration and must never block the collaborator list.
 */
export async function getClerkProfilesByEmail(
  emails: string[],
): Promise<Map<string, ClerkProfile>> {
  const wanted = [...new Set(emails.map(normalizeEmail))];
  const profiles = new Map<string, ClerkProfile>();

  if (wanted.length === 0) {
    return profiles;
  }

  const batches: string[][] = [];
  for (let i = 0; i < wanted.length; i += EMAILS_PER_REQUEST) {
    batches.push(wanted.slice(i, i + EMAILS_PER_REQUEST));
  }

  try {
    const client = await clerkClient();
    const responses = await Promise.all(
      batches.map((batch) =>
        client.users.getUserList({
          emailAddress: batch,
          limit: EMAILS_PER_REQUEST,
        }),
      ),
    );

    for (const { data: users } of responses) {
      for (const user of users) {
        const primaryEmail = user.primaryEmailAddress?.emailAddress;

        if (!primaryEmail) continue;

        profiles.set(normalizeEmail(primaryEmail), {
          name: user.fullName ?? user.username ?? null,
          avatarUrl: user.imageUrl,
        });
      }
    }
  } catch (error) {
    console.error("Failed to load collaborator profiles from Clerk.", error);
    return new Map();
  }

  return profiles;
}
