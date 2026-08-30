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
 * Shown when a name is made only of characters the slug trims away — blank,
 * whitespace, or hyphens — so it slugifies to nothing.
 */
export const NAME_NEEDS_SLUG_MESSAGE = "Use at least one letter or number.";

/**
 * Whether `name` contains anything `slugifyProjectName` cannot carry into the
 * slug.
 *
 * The check mirrors the slug pipeline rather than hardcoding a second rule: a
 * character is supported when its normalized, diacritic-stripped, lowercased
 * form is a letter, digit, space, or hyphen.
 *
 * Combining marks need the extra bookkeeping. They normalize away to nothing,
 * so they cannot be judged on their own form — only on what they attach to. A
 * mark riding on a base letter is the decomposed spelling of an accented
 * letter and is accepted, exactly as the precomposed spelling is. A mark with
 * no base letter in front of it, as in a name starting with one, has nothing
 * to accent: the slug drops it silently and the name would no longer match
 * what was typed, so it is rejected.
 */
export function hasUnsupportedCharacters(name: string): boolean {
  let followsBaseLetter = false;

  for (const character of name) {
    const normalized = character
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (normalized === "") {
      // A combining mark. Legitimate only on a base letter, and a letter can
      // carry several stacked marks, so the flag survives this branch.
      if (!followsBaseLetter) return true;
      continue;
    }

    if (!/^[a-z0-9 -]+$/.test(normalized)) return true;

    followsBaseLetter = /[a-z]$/.test(normalized);
  }

  return false;
}
