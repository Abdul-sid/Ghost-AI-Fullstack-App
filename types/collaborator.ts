/** A project collaborator as rendered by the share dialog. */
export interface Collaborator {
  id: string;
  /** The address access is granted to. Always present. */
  email: string;
  /** Display name from Clerk, or `null` when no Clerk user has this email. */
  name: string | null;
  /** Avatar image URL from Clerk, or `null` when no Clerk user has this email. */
  avatarUrl: string | null;
}
