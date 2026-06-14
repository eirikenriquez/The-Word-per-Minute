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
    <div className="grid grid-cols-4 rounded-md border border-slate-300 bg-slate-100 p-1 text-sm sm:flex">
      <ModeButton isSelected={appMode === "home"} label="Home" onSelect={() => onSelectMode("home")} />
      <ModeButton isSelected={appMode === "practice"} label="Practice" onSelect={() => onSelectMode("practice")} />
      <ModeButton isSelected={appMode === "bible"} label="Bible" onSelect={() => onSelectMode("bible")} />
      <ModeButton
        disabled={!hasSavedPassages}
        isSelected={appMode === "library"}
        label="Library"
        onSelect={() => onSelectMode("library")}
      />
    </div>
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
      className={`rounded px-3 py-1.5 font-medium ${
        isSelected ? "bg-white text-slate-950 shadow-sm" : "text-slate-600 hover:text-slate-900"
      } disabled:cursor-not-allowed disabled:text-slate-400`}
      disabled={disabled}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
