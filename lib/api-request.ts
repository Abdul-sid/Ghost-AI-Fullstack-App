export type JsonBodyResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string };

/**
 * Reads a request body as JSON without trusting its shape.
 *
 * An empty body resolves to `undefined` rather than failing, so endpoints with
 * optional input (such as creating a project with no name) accept bodyless
 * requests. Only a present-but-malformed body is an error.
 */
export async function readJsonBody(request: Request): Promise<JsonBodyResult> {
  const text = await request.text();

  if (text.trim() === "") {
    return { ok: true, value: undefined };
  }

  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, error: "Request body must be valid JSON." };
  }
}
