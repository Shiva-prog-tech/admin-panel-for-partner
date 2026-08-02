"use client";

import { useCallback } from "react";
import Sidebar from "./Components/SideBar";
import Topbar from "./Components/NavBar";
import ToastHost from "@/Components/Toast";
import PopupHandler from "@/Components/PopupHandler";
import CommandPalette from "@/Components/CommandPalette";
import useHotkey from "@/customHooks/useHotkey";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setPaletteOpen, setSidebarOpen } from "@/redux/reducers/ConfigReducer";
import styles from "./DashboardWrapper.module.scss";

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
    <div className={styles.shell}>
      <Sidebar open={sidebarOpen} onNavigate={closeSidebar} />

      {sidebarOpen && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      )}

      <main className={styles.stage}>
        <Topbar />
        <div className={styles.body}>{children}</div>
      </main>

      <CommandPalette />
      <PopupHandler />
      <ToastHost />
    </div>
  );
}
