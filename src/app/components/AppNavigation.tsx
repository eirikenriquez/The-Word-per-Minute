import {
  BookOpenIcon,
  BookmarkSquareIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import type { AppMode } from "../../shared/types/app";

type AppNavigationProps = {
  appMode: AppMode;
  hasSavedPassages: boolean;
  onSelectMode: (mode: AppMode) => void;
};

/**
 * Primary app navigation between URL-backed modes.
 */
export function AppNavigation({ appMode, hasSavedPassages, onSelectMode }: AppNavigationProps) {
  return (
    <nav className="grid grid-cols-4 gap-1 text-sm sm:flex sm:items-center">
      <ModeButton
        icon={<HomeIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
        isSelected={appMode === "home"}
        label="Home"
        onSelect={() => onSelectMode("home")}
      />
      <ModeButton
        icon={<PencilSquareIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
        isSelected={appMode === "practice"}
        label="Practice"
        onSelect={() => onSelectMode("practice")}
      />
      <ModeButton
        icon={<BookOpenIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
        isSelected={appMode === "bible"}
        label="Bible"
        onSelect={() => onSelectMode("bible")}
      />
      <ModeButton
        disabled={!hasSavedPassages}
        icon={<BookmarkSquareIcon aria-hidden="true" className="h-4 w-4 shrink-0" />}
        isSelected={appMode === "library"}
        label="Library"
        onSelect={() => onSelectMode("library")}
      />
    </nav>
  );
}

type ModeButtonProps = {
  disabled?: boolean;
  icon: ReactNode;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function ModeButton({ disabled = false, icon, isSelected, label, onSelect }: ModeButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 font-medium transition ${
        isSelected
          ? "bg-accent-soft text-accent-ink"
          : "text-ink-muted hover:bg-accent-soft hover:text-accent-ink"
      } disabled:cursor-not-allowed disabled:text-ink-subtle`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {icon}
      {label}
    </button>
  );
}
