export type AppHeaderProps = {
  headerReference: string;
  headerSubtitle: string;
  headerTitle: string;
};

/**
 * Displays the current page title and context.
 */
export function AppHeader({
  headerReference,
  headerSubtitle,
  headerTitle,
}: AppHeaderProps) {
  return (
    <section className="border-b border-line pb-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold uppercase text-ink-subtle">
          {headerSubtitle}
        </p>
        <h2 className="mt-1 text-2xl font-bold text-ink">
          {headerTitle}
        </h2>
        {headerReference && (
          <p className="mt-2 w-fit rounded-md bg-accent-soft px-2.5 py-1 text-sm font-semibold text-accent-ink ring-1 ring-accent-line">
            {headerReference}
          </p>
        )}
      </div>
    </section>
  );
}
