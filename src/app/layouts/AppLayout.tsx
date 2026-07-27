import { Outlet } from 'react-router';
import { PageShell } from '../components/PageShell';
import { useAppNavigation } from '../hooks/useAppNavigation';
import { useTheme } from '../hooks/useTheme';

/**
 * Global application layout shared by every product route.
 *
 * Route content renders through the outlet without receiving feature state
 * from the layout.
 */
export function AppLayout() {
  const { appMode, selectAppMode } = useAppNavigation();
  const { theme, toggleTheme } = useTheme();

  return (
    <PageShell
      appMode={appMode}
      theme={theme}
      onSelectMode={selectAppMode}
      onToggleTheme={toggleTheme}
    >
      <Outlet />
    </PageShell>
  );
}
