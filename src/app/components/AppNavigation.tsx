import type { AppMode } from '../types';

type AppNavigationProps = {
  appMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
};

/**
 * Primary app navigation between URL-backed modes.
 */
export function AppNavigation({ appMode, onSelectMode }: AppNavigationProps) {
  return (
    <nav className="grid grid-cols-4 gap-1 text-sm sm:flex sm:items-center">
      <ModeButton
        isSelected={appMode === 'home'}
        label="Home"
        onSelect={() => onSelectMode('home')}
      />
      <ModeButton
        isSelected={appMode === 'practice'}
        label="Practice"
        onSelect={() => onSelectMode('practice')}
      />
      <ModeButton
        isSelected={appMode === 'bible'}
        label="Bible"
        onSelect={() => onSelectMode('bible')}
      />
      <ModeButton
        isSelected={appMode === 'library'}
        label="Library"
        onSelect={() => onSelectMode('library')}
      />
    </nav>
  );
}

type ModeButtonProps = {
  isSelected: boolean;
  label: string;
  onSelect: () => void;
};

function ModeButton({ isSelected, label, onSelect }: ModeButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center rounded-md border-b-2 px-3 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas ${
        isSelected
          ? 'border-accent text-ink'
          : 'border-transparent text-ink-muted hover:border-line-strong hover:text-ink'
      }`}
      type="button"
      onClick={onSelect}
    >
      {label}
    </button>
  );
}
