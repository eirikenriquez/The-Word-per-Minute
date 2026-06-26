/**
 * Converts unknown caught errors into UI-safe messages.
 * Keeping this shared avoids repeating the same catch-block helper in hooks.
 */
export function getErrorMessage(caughtError: unknown) {
  return caughtError instanceof Error ? caughtError.message : "Something went wrong.";
}
