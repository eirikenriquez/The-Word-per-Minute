import type { AppMode } from "../../types/appMode";

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
      <ModeButton isSelected={appMode === "home"} label="Home" onSelect={() => onSelectMode("home")} />
      <ModeButton isSelected={appMode === "practice"} label="Practice" onSelect={() => onSelectMode("practice")} />
      <ModeButton isSelected={appMode === "bible"} label="Bible" onSelect={() => onSelectMode("bible")} />
      <ModeButton
        disabled={!hasSavedPassages}
        isSelected={appMode === "library"}
        label="Library"
        onSelect={() => onSelectMode("library")}
      />
    </nav>
  );
}

type ModeButtonProps = {
  disabled?: boolean;
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function ModeButton({ disabled = false, isSelected, label, onSelect }: ModeButtonProps) {
  return (
    <button
      className={`rounded-md px-3 py-2 font-medium transition ${
        isSelected ? "bg-blue-50 text-blue-800" : "text-slate-600 hover:bg-blue-50 hover:text-blue-800"
      } disabled:cursor-not-allowed disabled:text-slate-400`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
