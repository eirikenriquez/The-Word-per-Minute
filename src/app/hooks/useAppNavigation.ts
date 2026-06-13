import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { AppMode } from "../../types/appMode";
import { getAppModeFromPathname, getPathnameFromAppMode } from "../routes/appRoutePaths";

/**
 * Bridges React Router URLs with the app's mode-based navigation.
 * Components can work with AppMode while the browser still gets real routes.
 */
export function useAppNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const appMode = getAppModeFromPathname(location.pathname);

  const selectAppMode = useCallback(
    (mode: AppMode) => {
      navigate(getPathnameFromAppMode(mode));
    },
    [navigate],
  );

  return {
    appMode,
    selectAppMode,
  };
}
