import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import type { PracticeAttempt } from "../../../shared/types/practice";

type PracticeAttemptCardProps = {
  attempt: PracticeAttempt;
};

/**
 * Displays one completed practice attempt and its expandable reflection.
 */
export function PracticeAttemptCard({ attempt }: PracticeAttemptCardProps) {
  const shouldCollapseReflection = Boolean(attempt.reflection && attempt.reflection.length > 240);

  return (
    <article className="rounded-lg border border-line bg-surface p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="font-semibold text-ink">{attempt.passageReference}</h4>
          <p className="mt-1 text-sm text-ink-subtle">
            {formatCompletedDate(attempt.completedAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
          <span>
            <strong className="text-ink">{attempt.wpm}</strong> WPM
          </span>
          <span>
            <strong className="text-ink">{attempt.accuracy}%</strong> accuracy
          </span>
          <span>
            <strong className="text-ink">{attempt.durationSeconds}s</strong> typing
          </span>
        </div>
      </div>

      {attempt.reflection ? (
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosurePanel
                static
                className={`relative mt-4 overflow-hidden border-l-2 border-accent-line pl-3 transition-[max-height] duration-200 ease-out ${
                  shouldCollapseReflection && !open ? "max-h-28" : "max-h-[32rem] overflow-y-auto pr-2"
                }`}
              >
                <p className="text-sm leading-6 text-ink-muted">
                  {attempt.reflection}
                </p>
                {shouldCollapseReflection && !open ? (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-surface to-transparent"
                  />
                ) : null}
              </DisclosurePanel>

              {shouldCollapseReflection ? (
                <DisclosureButton className="mt-3 text-sm font-medium text-ink-muted transition-colors hover:text-ink">
                  {open ? "Show less" : "View full reflection"}
                </DisclosureButton>
              ) : null}
            </>
          )}
        </Disclosure>
      ) : (
        <p className="mt-4 text-sm text-ink-subtle">
          No reflection yet.
        </p>
      )}
    </article>
  );
}

function formatCompletedDate(completedAt: string) {
  const date = new Date(completedAt);
  if (Number.isNaN(date.getTime())) return "Completed";

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
