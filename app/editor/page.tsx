import { EditorHome } from "@/components/editor/editor-home";

/**
 * Editor home. Kept a server component so
 * `context/feature-specs/07-wire-editor-home.md` can fetch the owned and shared
 * project lists here and pass them down.
 */
export default function EditorPage() {
  return <EditorHome />;
}
