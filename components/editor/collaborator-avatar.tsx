import Image from "next/image";

import type { Collaborator } from "@/types/collaborator";

interface CollaboratorAvatarProps {
  collaborator: Collaborator;
}

/**
 * The collaborator's Clerk avatar, or — when no Clerk user has their email —
 * a neutral circle with the email's first letter so rows stay aligned.
 * Decorative either way: the name or email is always rendered beside it.
 */
export function CollaboratorAvatar({ collaborator }: CollaboratorAvatarProps) {
  if (collaborator.avatarUrl) {
    return (
      <Image
        src={collaborator.avatarUrl}
        alt=""
        width={32}
        height={32}
        className="h-8 w-8 shrink-0 rounded-full border border-surface-border object-cover"
      />
    );
  }

  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-surface-border bg-subtle text-xs font-medium uppercase text-copy-secondary"
    >
      {collaborator.email.charAt(0)}
    </span>
  );
}
