import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { AppMode } from "../../types/appMode";
import { APP_ROUTE_PATHS } from "../routes/appRoutePaths";

type AppRoutesProps = {
  pages: Record<AppMode, ReactNode>;
};

/**
 * URL router for the main app pages.
 * Each page is built before it gets here, so this component only maps paths to screens.
 */
export function AppRoutes({ pages }: AppRoutesProps) {
  return (
    <Routes>
      <Route element={pages.home} path={APP_ROUTE_PATHS.home} />
      <Route element={pages.practice} path={APP_ROUTE_PATHS.practice} />
      <Route element={pages.bible} path={APP_ROUTE_PATHS.bible} />
      <Route element={pages.library} path={APP_ROUTE_PATHS.library} />
      <Route element={<Navigate replace to={APP_ROUTE_PATHS.home} />} path="*" />
    </Routes>
  );
}
