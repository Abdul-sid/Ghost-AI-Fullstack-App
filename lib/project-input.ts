import { isValidRoomId, MAX_ROOM_ID_LENGTH } from "@/lib/room-id";

export const DEFAULT_PROJECT_NAME = "Untitled Project";

export type ParseResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface CreateProjectInput {
  name: string;
  /**
   * Caller-chosen project ID, which doubles as the Liveblocks room ID. When
   * absent the schema's `@default(cuid())` supplies one.
   */
  id?: string;
}

export interface RenameProjectInput {
  name: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates the body of `POST /api/projects`.
 *
 * The body, its `name`, and its `id` are all optional. A missing, null, or
 * blank name falls back to `DEFAULT_PROJECT_NAME`; a name of any other type is
 * rejected. An `id` must be a well-formed room ID.
 */
export function parseCreateProjectInput(
  body: unknown,
): ParseResult<CreateProjectInput> {
  if (body === undefined) {
    return { success: true, data: { name: DEFAULT_PROJECT_NAME } };
  }

  if (!isRecord(body)) {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const { name, id } = body;

  if (name !== undefined && name !== null && typeof name !== "string") {
    return { success: false, error: "`name` must be a string." };
  }

  let roomId: string | undefined;

  if (id !== undefined) {
    if (typeof id !== "string" || !isValidRoomId(id)) {
      return {
        success: false,
        error: `\`id\` must be lowercase letters and numbers joined by single hyphens, at most ${MAX_ROOM_ID_LENGTH} characters.`,
      };
    }

    roomId = id;
  }

  return {
    success: true,
    data: {
      name: (typeof name === "string" && name.trim()) || DEFAULT_PROJECT_NAME,
      id: roomId,
    },
  };
}

/**
 * Validates the body of `PATCH /api/projects/[projectId]`.
 *
 * Renaming requires a non-blank string name; there is no default to fall back
 * to, since an empty rename is a caller mistake rather than a missing value.
 */
export function parseRenameProjectInput(
  body: unknown,
): ParseResult<RenameProjectInput> {
  if (!isRecord(body)) {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const { name } = body;

  if (typeof name !== "string" || name.trim() === "") {
    return { success: false, error: "`name` must be a non-empty string." };
  }

  return { success: true, data: { name: name.trim() } };
}
