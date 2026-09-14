import { CircleAlert } from "lucide-react";

interface DialogErrorMessageProps {
  /** Lets an input point at the message through `aria-describedby`. */
  id?: string;
  message: string;
}

/** Error row shown inside an editor dialog when a submit is rejected. */
export function DialogErrorMessage({ id, message }: DialogErrorMessageProps) {
  return (
    <p
      id={id}
      role="alert"
      className="flex items-start gap-1.5 text-xs text-error"
    >
      <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
