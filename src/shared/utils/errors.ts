/**
 * Converts unknown caught errors into UI-safe messages.
 * Keeping this shared avoids repeating the same catch-block helper in hooks.
 */
export function getErrorMessage(caughtError: unknown) {
  if (caughtError instanceof Error) return caughtError.message;

  if (hasMessage(caughtError)) {
    return caughtError.message;
  }

  return "Something went wrong.";
}

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof value.message === "string"
  );
}
