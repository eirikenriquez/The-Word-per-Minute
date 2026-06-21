import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "danger" | "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex min-h-9 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    "font-medium text-red-700 hover:bg-red-50 hover:text-red-800 disabled:text-red-300 dark:text-red-400 dark:hover:bg-red-950/60 dark:hover:text-red-300 dark:disabled:text-red-900",
  primary:
    "border border-line-strong bg-action font-semibold text-action-ink hover:bg-action-hover disabled:border-line disabled:bg-surface-muted disabled:text-ink-subtle",
  secondary:
    "border border-line-strong bg-surface font-medium text-ink-muted hover:border-accent-line hover:bg-accent-soft hover:text-accent-ink disabled:border-line disabled:text-ink-subtle",
  ghost:
    "font-medium text-ink-muted hover:bg-surface-muted hover:text-ink disabled:text-ink-subtle",
};

/**
 * Shared visual hierarchy for ordinary app actions.
 * Bespoke controls such as navigation tabs and verse buttons keep their own styling.
 */
export function Button({
  className = "",
  type = "button",
  variant = "secondary",
  ...buttonProps
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`.trim()}
      type={type}
      {...buttonProps}
    />
  );
}
