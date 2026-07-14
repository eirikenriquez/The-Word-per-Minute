import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRef, useState } from "react";
import { Button } from "../../../shared/ui/Button";

type PracticeReflectionDialogProps = {
  canSaveReflection: boolean;
  isSavingReflection: boolean;
  isSignedIn: boolean;
  onSaveReflection: (reflection: string) => Promise<boolean>;
  reflectionError: string | null;
};

/**
 * Owns the reflection trigger, dialog state, and save interaction shown after practice.
 */
export function PracticeReflectionDialog({
  canSaveReflection,
  isSavingReflection,
  isSignedIn,
  onSaveReflection,
  reflectionError,
}: PracticeReflectionDialogProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [hasSavedReflection, setHasSavedReflection] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const reflectionInputRef = useRef<HTMLTextAreaElement>(null);

  async function saveReflection() {
    const didSave = await onSaveReflection(reflectionText);
    if (!didSave) return;

    setHasSavedReflection(true);
    setReflectionText("");
    setIsOpen(false);
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setIsOpen(true)}>
        Add reflection
      </Button>

      <Dialog
        className="fixed inset-0 z-50 grid place-items-center px-4 py-6"
        initialFocus={reflectionInputRef}
        open={isOpen}
        onClose={setIsOpen}
      >
        <DialogPanel
          transition
          className="grid w-full max-w-xl gap-4 rounded-xl border border-line bg-surface p-5 text-left shadow-2xl transition duration-150 ease-out data-closed:translate-y-1 data-closed:scale-[0.98] data-closed:opacity-0 data-enter:duration-150 data-leave:duration-100 data-leave:ease-in motion-reduce:transform-none motion-reduce:transition-none"
        >
          <div className="grid gap-1">
            <DialogTitle className="text-lg font-semibold text-ink">
              What stood out to you?
            </DialogTitle>
            <p className="text-sm text-ink-muted">
              Save a short reflection from this passage to your practice history.
            </p>
          </div>

          <label className="grid gap-2">
            <span className="sr-only">Reflection</span>
            <textarea
              className="h-32 resize-none rounded-md border border-line-strong bg-canvas p-3 text-sm text-ink outline-none transition placeholder:text-ink-subtle focus:border-accent focus:ring-2 focus:ring-accent-soft disabled:bg-surface-muted disabled:text-ink-subtle"
              disabled={!isSignedIn || hasSavedReflection}
              placeholder={
                isSignedIn
                  ? "Write a short reflection from this passage..."
                  : "Create an account to keep reflections with your practice history."
              }
              ref={reflectionInputRef}
              value={reflectionText}
              onChange={(event) => {
                setReflectionText(event.target.value);
                setHasSavedReflection(false);
              }}
            />
          </label>

          {isSignedIn ? (
            <div className="grid gap-3">
              <div className="flex flex-wrap items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button
                  disabled={
                    !canSaveReflection ||
                    !reflectionText.trim() ||
                    hasSavedReflection ||
                    isSavingReflection
                  }
                  variant="secondary"
                  onClick={saveReflection}
                >
                  {isSavingReflection ? "Saving..." : hasSavedReflection ? "Saved" : "Save reflection"}
                </Button>
              </div>
              {!canSaveReflection && (
                <p className="text-sm text-ink-subtle">Saving your practice history...</p>
              )}
              {hasSavedReflection && (
                <p className="text-sm font-medium text-accent-ink">Reflection saved.</p>
              )}
              {reflectionError && (
                <p className="text-sm text-red-700 dark:text-red-300">{reflectionError}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-ink-muted">
                Sign in or create an account to save reflections after practice.
              </p>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogPanel>
      </Dialog>
    </>
  );
}
