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

/** The one sentence that states what a project name may contain. */
export const SUPPORTED_NAME_MESSAGE =
  "Use letters, numbers, spaces, and hyphens.";

/**
 * Whether `name` contains anything `slugifyProjectName` cannot carry into the
 * slug.
 *
 * The check mirrors the slug pipeline rather than hardcoding a second rule: a
 * character is supported when its normalized, diacritic-stripped, lowercased
 * form is a letter, digit, space, or hyphen. Accented letters are therefore
 * fine (`e` with an acute becomes `e`), while `!` collapses to a separator and
 * a non-Latin script vanishes entirely — both unsupported.
 */
export function hasUnsupportedCharacters(name: string): boolean {
  for (const character of name) {
    const normalized = character
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    // A standalone combining mark normalizes away completely; it rides on the
    // letter before it and never reaches the slug on its own.
    if (normalized === "") continue;
    if (/^[a-z0-9 -]+$/.test(normalized)) continue;

    return true;
  }

  return false;
}
