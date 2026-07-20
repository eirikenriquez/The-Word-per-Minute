import { Link } from "react-router-dom";

export function AppFooter() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 pt-8 pb-20 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
        <div className="grid gap-3">
          <Link className="inline-flex w-fit items-center gap-2.5" to="/" aria-label="The Word per Minute home">
            <span className="relative h-7 w-6 shrink-0" aria-hidden="true">
              <img
                alt=""
                className="absolute inset-0 h-full w-full object-contain dark:hidden"
                src="/brand/symbol-light.svg"
              />
              <img
                alt=""
                className="absolute inset-0 hidden h-full w-full object-contain dark:block"
                src="/brand/symbol-dark.svg"
              />
            </span>
            <span className="font-semibold text-ink">The Word per Minute</span>
          </Link>

          <p className="max-w-xl text-sm leading-6 text-ink-muted">
            A quiet place to read Scripture, save meaningful passages, and practice typing.
          </p>

          <p className="text-xs text-ink-subtle">
            Guests save passages locally. Signed-in users can sync saved passages to their account.
          </p>
        </div>

        <div className="grid gap-3 text-sm text-ink-muted lg:justify-items-end">
          <nav aria-label="Footer links" className="flex flex-wrap gap-x-5 gap-y-2">
            <a
              className="transition hover:text-accent-ink"
              href="https://worldenglish.bible/"
              rel="noreferrer"
              target="_blank"
            >
              World English Bible &middot; Public Domain
            </a>
            <a
              className="transition hover:text-accent-ink"
              href="https://github.com/eirikenriquez/The-Word-per-Minute"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
            </a>
          </nav>

          <p className="text-xs text-ink-subtle">
            &copy; {new Date().getFullYear()} The Word per Minute
          </p>
        </div>
      </div>
    </footer>
  );
}
