type AppErrorStateProps = {
  message: string;
};

/**
 * Shared error panel for app-level failures and empty states.
 */
export function AppErrorState({ message }: AppErrorStateProps) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-800/60 dark:bg-rose-950/50 dark:text-rose-100">
      {message}
    </div>
  );
}
