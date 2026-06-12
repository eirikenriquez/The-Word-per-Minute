import type { ReactNode } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import type { AppMode } from "../../types/appMode";

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
      <Route element={pages.home} path="/" />
      <Route element={pages.practice} path="/practice" />
      <Route element={pages.bible} path="/bible" />
      <Route element={pages.library} path="/library" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
}
