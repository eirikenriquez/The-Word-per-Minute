type AppLoadingStateProps = {
  message?: string;
};

/**
 * Shared loading panel for app-level data that must exist before a page can render.
 */
export function AppLoadingState({ message = "Loading practice passage..." }: AppLoadingStateProps) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 text-ink-muted shadow-sm">
      {message}
    </div>
  );
}
