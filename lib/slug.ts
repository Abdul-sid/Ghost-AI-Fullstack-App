/**
 * Turns a project name into a URL-safe slug: lowercase, diacritics stripped,
 * and every run of non-alphanumeric characters collapsed to a single hyphen.
 *
 * Used for the live slug preview in the Create Project dialog.
 * `context/feature-specs/07-wire-editor-home.md` appends a short unique suffix
 * to this value to produce the room ID.
 */
export function slugifyProjectName(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
