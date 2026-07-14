import {
  ChevronDownIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
} from "react";

type AuthMenuButtonProps = ComponentPropsWithoutRef<"button"> & {
  isOpen: boolean;
  label: string;
};

export const AuthMenuButton = forwardRef<HTMLButtonElement, AuthMenuButtonProps>(
  function AuthMenuButton({ isOpen, label, ...buttonProps }, ref) {
  return (
    <button
      aria-label={label}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      ref={ref}
      type="button"
      {...buttonProps}
    >
      <UserCircleIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
      <ChevronDownIcon
        aria-hidden="true"
        className={`absolute h-3 w-3 translate-x-3 translate-y-3 rounded-full bg-surface text-ink-subtle transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
  },
);
