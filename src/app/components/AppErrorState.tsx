type AppErrorStateProps = {
  message: string;
};

/**
 * Shared error panel for app-level failures and empty states.
 */
export function AppErrorState({ message }: AppErrorStateProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 dark:border-red-800/60 dark:bg-red-950/50 dark:text-red-100">
      {message}
    </div>
  );
}
