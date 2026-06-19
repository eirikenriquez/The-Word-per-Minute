import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "danger" | "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "inline-flex min-h-9 items-center justify-center rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 disabled:cursor-not-allowed dark:focus-visible:ring-offset-slate-950";

const variantClasses: Record<ButtonVariant, string> = {
  danger:
    "font-medium text-red-700 hover:bg-red-50 hover:text-red-800 disabled:text-red-300 dark:text-red-400 dark:hover:bg-red-950/60 dark:hover:text-red-300 dark:disabled:text-red-900",
  primary:
    "bg-blue-700 font-semibold text-white hover:bg-blue-800 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:disabled:bg-blue-900 dark:disabled:text-blue-300",
  secondary:
    "border border-slate-300 font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 disabled:border-slate-200 disabled:text-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-200 dark:disabled:border-slate-800 dark:disabled:text-slate-600",
  ghost:
    "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 disabled:text-slate-400 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-100 dark:disabled:text-slate-600",
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
