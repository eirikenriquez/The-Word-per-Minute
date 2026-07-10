import type { PracticeAttempt } from "../../shared/types/practice";

export type ProfilePageProps = {
  isSignedIn: boolean;
  isLoadingPracticeAttempts: boolean;
  practiceAttempts: PracticeAttempt[];
  practiceAttemptError: string | null;
  userEmail?: string;
};

export function ProfilePage({
  isSignedIn,
  isLoadingPracticeAttempts,
  practiceAttempts,
  practiceAttemptError,
  userEmail,
}: ProfilePageProps) {
  const completedAttempts = practiceAttempts.length;
  const bestWpm = practiceAttempts.reduce((best, attempt) => Math.max(best, attempt.wpm), 0);
  const averageAccuracy = completedAttempts
    ? Math.round(
        practiceAttempts.reduce((total, attempt) => total + attempt.accuracy, 0) / completedAttempts,
      )
    : 0;

  return (
    <section className="grid gap-8">
      <div className="grid gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
          Account and progress
        </p>
        <h2 className="text-3xl font-bold text-ink sm:text-4xl">
          Profile
        </h2>
        <p className="max-w-2xl text-base leading-7 text-ink-muted">
          Review your saved account progress and the passages you have completed.
        </p>
      </div>

      {!isSignedIn ? (
        <ProfileMessage>
          Sign in or create an account to keep a cloud practice history.
        </ProfileMessage>
      ) : (
        <>
          <section className="grid gap-3 rounded-lg border border-line bg-surface p-5">
            <div>
              <p className="text-sm font-semibold text-ink">Signed in</p>
              <p className="mt-1 text-sm text-ink-subtle">{userEmail ?? "Account active"}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ProfileStat label="Recent sessions" value={completedAttempts} />
              <ProfileStat label="Best WPM" value={bestWpm} />
              <ProfileStat label="Average accuracy" value={`${averageAccuracy}%`} />
            </div>
          </section>

          <section className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold text-ink">Recent practice</h3>
              <p className="mt-1 text-sm text-ink-subtle">
                Completed signed-in sessions will appear here.
              </p>
            </div>

            {practiceAttemptError ? (
              <ProfileMessage>{practiceAttemptError}</ProfileMessage>
            ) : isLoadingPracticeAttempts ? (
              <ProfileMessage>Loading practice history...</ProfileMessage>
            ) : practiceAttempts.length ? (
              <div className="grid gap-3">
                {practiceAttempts.map((attempt) => (
                  <PracticeAttemptCard attempt={attempt} key={attempt.id} />
                ))}
              </div>
            ) : (
              <ProfileMessage>
                Complete a practice passage while signed in to start your history.
              </ProfileMessage>
            )}
          </section>
        </>
      )}
    </section>
  );
}

function ProfileStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-md border border-line bg-surface-muted p-4">
      <p className="text-sm text-ink-subtle">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </div>
  );
}

function PracticeAttemptCard({ attempt }: { attempt: PracticeAttempt }) {
  return (
    <article className="rounded-md border border-line bg-surface p-4">
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

      {attempt.reflection && (
        <p className="mt-3 border-l-2 border-accent-line pl-3 text-sm leading-6 text-ink-muted">
          {attempt.reflection}
        </p>
      )}
    </article>
  );
}

function ProfileMessage({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-dashed border-line-strong bg-surface-muted p-4 text-sm text-ink-muted">
      {children}
    </div>
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
