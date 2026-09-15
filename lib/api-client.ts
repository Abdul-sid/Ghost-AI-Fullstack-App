export interface ApiFailure {
  ok: false;
  /** HTTP status, or `null` when the request never reached the server. */
  status: number | null;
  error: string;
}

export type ApiResult = { ok: true; data: unknown } | ApiFailure;

export const FALLBACK_ERROR = "Something went wrong. Please try again.";
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
 * Sends a request to the app's own API and reduces the response to its parsed
 * JSON body or a displayable error. Failures carry the API's `{ error }`
 * message when present. The success body is `unknown` — callers validate it.
 */
export async function sendApiRequest(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  body?: Record<string, unknown>,
): Promise<ApiResult> {
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

  const responseBody: unknown = await response.json().catch(() => null);

  if (response.ok) {
    return { ok: true, data: responseBody };
  }

  return {
    ok: false,
    status: response.status,
    error: readErrorMessage(responseBody) ?? FALLBACK_ERROR,
  };
}
