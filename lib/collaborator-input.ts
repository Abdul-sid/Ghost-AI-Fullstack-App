import type { ParseResult } from "@/lib/project-input";

/** The longest address SMTP allows (RFC 5321). */
export const MAX_EMAIL_LENGTH = 254;

export const INVALID_EMAIL_MESSAGE = "Enter a valid email address.";

/** One `@`, no whitespace, and a dot somewhere in the domain. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface InviteCollaboratorInput {
  /** Trimmed and lowercased — the form collaborator rows are stored in. */
  email: string;
}

/**
 * Collaborator emails are stored trimmed and lowercased, so the
 * `@@unique([projectId, email])` constraint cannot hold two spellings of one
 * address.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Whether `email`, once normalized, looks like a deliverable address. */
export function isValidEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  return (
    normalized.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(normalized)
  );
}

/** Validates the body of `POST /api/projects/[projectId]/collaborators`. */
export function parseInviteCollaboratorInput(
  body: unknown,
): ParseResult<InviteCollaboratorInput> {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const { email } = body as Record<string, unknown>;

  if (typeof email !== "string" || !isValidEmail(email)) {
    return { success: false, error: INVALID_EMAIL_MESSAGE };
  }

  return { success: true, data: { email: normalizeEmail(email) } };
}
