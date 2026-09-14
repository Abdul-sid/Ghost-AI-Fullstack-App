import { slugifyProjectName } from "@/lib/slug";

/** Liveblocks room IDs are capped at 128 characters. */
export const MAX_ROOM_ID_LENGTH = 128;

const SUFFIX_LENGTH = 8;
const SUFFIX_ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

/** Lowercase letters and digits in runs joined by single hyphens. */
const ROOM_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * A short random suffix that keeps room IDs unique when two projects share a
 * name. Generated once per create dialog so the preview and the stored ID
 * match.
 */
export function createRoomIdSuffix(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(SUFFIX_LENGTH));

  return Array.from(
    bytes,
    (byte) => SUFFIX_ALPHABET[byte % SUFFIX_ALPHABET.length],
  ).join("");
}

/**
 * Builds a project's room ID: the slugified name plus `suffix`. The room ID is
 * also the project's database ID, so the URL, the Liveblocks room, and the
 * project record all share one identifier.
 *
 * The slug is shortened when needed so the whole ID fits `MAX_ROOM_ID_LENGTH`.
 */
export function buildRoomId(name: string, suffix: string): string {
  const maxSlugLength = MAX_ROOM_ID_LENGTH - suffix.length - 1;
  const slug = slugifyProjectName(name)
    .slice(0, maxSlugLength)
    .replace(/-+$/, "");

  return slug ? `${slug}-${suffix}` : suffix;
}

/** Whether `value` is a well-formed room ID. */
export function isValidRoomId(value: string): boolean {
  return value.length <= MAX_ROOM_ID_LENGTH && ROOM_ID_PATTERN.test(value);
}
