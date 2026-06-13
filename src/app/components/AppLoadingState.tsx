type AppLoadingStateProps = {
  message?: string;
};

/**
 * Shared loading panel for app-level data that must exist before a page can render.
 */
export function AppLoadingState({ message = "Loading practice passage..." }: AppLoadingStateProps) {
  return (
    <div className="rounded-xl border bg-white p-4 text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {message}
    </div>
  );
}
