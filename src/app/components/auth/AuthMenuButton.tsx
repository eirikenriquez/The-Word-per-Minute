import {
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

type AuthMenuButtonProps = {
  isOpen: boolean;
  label: string;
  onClick: () => void;
};

export function AuthMenuButton({ isOpen, label, onClick }: AuthMenuButtonProps) {
  return (
    <button
      aria-label={label}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      type="button"
      onClick={onClick}
    >
      <UserCircleIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute h-3 w-3 translate-x-3 translate-y-3 rounded-full bg-surface text-ink-subtle transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}
