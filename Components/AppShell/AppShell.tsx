"use client";

import { useCallback } from "react";
import Sidebar from "@/Components/Sidebar/Sidebar";
import Topbar from "@/Components/Topbar/Topbar";
import ToastHost from "@/Components/Toast/ToastHost";
import CommandPalette from "@/Components/CommandPalette/CommandPalette";
import useHotkey from "@/customHooks/useHotkey";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaletteOpen, setSidebarOpen } from "@/redux/reducers/configSlice";

/**
 * The persistent chrome: floating sidebar on the left, main stage on the
 * right. Every route renders inside `.stage__body`.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((state) => state.config.sidebarOpen);

  const closeSidebar = useCallback(() => {
    dispatch(setSidebarOpen(false));
  }, [dispatch]);

  useHotkey("k", () => dispatch(setPaletteOpen(true)), { meta: true });

  return (
    <div className="shell">
      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />

      {sidebarOpen && (
        <button
          type="button"
          className="scrim"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      <main className="stage">
        <Topbar />
        <div className="stage__body">{children}</div>
      </main>

      <CommandPalette />
      <ToastHost />
    </div>
  );
}
