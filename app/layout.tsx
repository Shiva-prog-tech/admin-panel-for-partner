import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import "@/styles/App.scss";
import ReduxProvider from "@/redux/provider";
import SessionBootstrap from "@/Components/AuthWrapper/SessionBootstrap";
import { APP_NAME, APP_TAGLINE } from "@/types/constants";

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} · Travls Live`,
    template: `%s · ${APP_NAME}`,
  },
  description: `${APP_TAGLINE} — issue cards, review cardholders and monitor custody in one place.`,
  applicationName: APP_NAME,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2f2f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e11" },
  ],
};

/**
 * Stamps the stored theme onto <html> before first paint so the panel never
 * flashes light while hydrating into dark.
 */
const THEME_BOOT = `
(function(){
  try {
    var stored = localStorage.getItem('pap.theme');
    var theme = stored === 'dark' || stored === 'light'
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <ReduxProvider>
          <SessionBootstrap />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
