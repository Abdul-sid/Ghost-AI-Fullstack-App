/**
 * Body of every non-2xx API response, so clients read failures one way.
 */
export interface ApiErrorBody {
  error: string;
}

export function errorResponse(status: number, message: string): Response {
  return Response.json({ error: message } satisfies ApiErrorBody, { status });
}

export function unauthenticatedResponse(): Response {
  return errorResponse(401, "Authentication required.");
}
