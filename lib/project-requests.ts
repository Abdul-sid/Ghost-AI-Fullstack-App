export type ProjectRequestResult =
  | { ok: true }
  | { ok: false; status: number | null; error: string };

const FALLBACK_ERROR = "Something went wrong. Please try again.";
const NETWORK_ERROR =
  "Could not reach the server. Check your connection and try again.";

function readErrorMessage(body: unknown): string | null {
  if (typeof body === "object" && body !== null && "error" in body) {
    const { error } = body;
    return typeof error === "string" ? error : null;
  }

  return null;
}

/**
 * Sends a project API request and reduces the response to success or a
 * displayable error. Failures carry the API's `{ error }` message when present.
 */
async function sendProjectRequest(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
): Promise<ProjectRequestResult> {
  let response: Response;

  try {
    response = await fetch(url, {
      method,
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
  } catch {
    return { ok: false, status: null, error: NETWORK_ERROR };
  }

  if (response.ok) {
    return { ok: true };
  }

  const errorBody: unknown = await response.json().catch(() => null);

  return {
    ok: false,
    status: response.status,
    error: readErrorMessage(errorBody) ?? FALLBACK_ERROR,
  };
}

function projectUrl(projectId: string): string {
  return `/api/projects/${encodeURIComponent(projectId)}`;
}

/** Creates a project whose ID is `roomId`. */
export function createProject(
  name: string,
  roomId: string,
): Promise<ProjectRequestResult> {
  return sendProjectRequest("/api/projects", "POST", { name, id: roomId });
}

export function renameProject(
  projectId: string,
  name: string,
): Promise<ProjectRequestResult> {
  return sendProjectRequest(projectUrl(projectId), "PATCH", { name });
}

export function deleteProject(
  projectId: string,
): Promise<ProjectRequestResult> {
  return sendProjectRequest(projectUrl(projectId), "DELETE");
}
