import type { PracticeAttempt } from "../../shared/types/practice";
import { PracticeAttemptCard } from "./components/PracticeAttemptCard";

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
  const reflectionCount = practiceAttempts.filter((attempt) => attempt.reflection).length;
  const bestWpm = practiceAttempts.reduce((best, attempt) => Math.max(best, attempt.wpm), 0);
  const averageAccuracy = completedAttempts
    ? Math.round(
        practiceAttempts.reduce((total, attempt) => total + attempt.accuracy, 0) / completedAttempts,
      )
    : 0;

  return (
    <section className="grid gap-8">
      <div className="grid gap-4">
        <div className="grid gap-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
            Account and progress
          </p>
          <h2 className="text-3xl font-bold text-ink sm:text-4xl">
            Progress
          </h2>
          <p className="max-w-2xl text-base leading-7 text-ink-muted">
            A quiet record of passages you have practiced and reflections you have kept.
          </p>
        </div>

        {isSignedIn && (
          <p className="text-sm text-ink-subtle">
            Signed in as <span className="font-medium text-ink-muted">{userEmail ?? "your account"}</span>
          </p>
        )}
      </div>

      {!isSignedIn ? (
        <ProfileMessage>
          Create an account to keep your practice history and reflections across sessions.
        </ProfileMessage>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-start">
          <aside className="grid gap-6 border-y border-line py-5 lg:sticky lg:top-28 lg:border-y-0 lg:border-r lg:py-0 lg:pr-6">
            <section className="grid gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                Account
              </h3>
              <p className="break-words text-sm font-medium text-ink-muted">
                {userEmail ?? "Account active"}
              </p>
              <p className="text-sm leading-6 text-ink-subtle">
                Saved passages and practice history can sync with this account.
              </p>
            </section>

            <section className="grid gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-subtle">
                Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <ProfileStat label="Sessions" value={completedAttempts} />
                <ProfileStat label="Reflections" value={reflectionCount} />
                <ProfileStat label="Average accuracy" value={`${averageAccuracy}%`} />
                <ProfileStat label="Best WPM" value={bestWpm} />
              </div>
            </section>
          </aside>

          <section className="grid gap-5">
            <div>
              <h3 className="text-xl font-semibold text-ink">Recent practice</h3>
              <p className="mt-1 text-sm text-ink-subtle">
                Revisit the passages you have typed and what stood out along the way.
              </p>
            </div>

            {practiceAttemptError ? (
              <ProfileMessage>{practiceAttemptError}</ProfileMessage>
            ) : isLoadingPracticeAttempts ? (
              <ProfileMessage>Loading practice history...</ProfileMessage>
            ) : practiceAttempts.length ? (
              <div className="grid gap-4">
                {practiceAttempts.map((attempt) => (
                  <PracticeAttemptCard attempt={attempt} key={attempt.id} />
                ))}
              </div>
            ) : (
              <ProfileMessage>
                Complete a passage while signed in to begin your practice history.
              </ProfileMessage>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

function ProfileStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div>
      <p className="text-sm text-ink-subtle">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink lg:text-xl">{value}</p>
    </div>
  );
}

function ProfileMessage({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-dashed border-line-strong bg-surface-muted p-4 text-sm text-ink-muted">
      {children}
    </div>
  );
}
