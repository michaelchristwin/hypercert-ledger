import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@vercel/remix";
import { useNavigation } from "@remix-run/react";

import "./tailwind.css";
import Navbar from "~/components/Navbar";
import { AppKitProvider } from "./web3modal";
import LoadingOverlay from "./components/LoadingOverlay";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap",
  },
];
const rootStyles = {
  fontFamily: "'Urbanist', sans-serif",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={rootStyles}>
        <AppKitProvider>
          <Navbar />
          {isLoading && <LoadingOverlay />}
          <div
            className={`lg:p-[100px] md:p-[100px] p-[10px] min-h-screen w-full bg-gradient-to-br from-blue-600 via-blue-800 to-purple-900 text-black`}
          >
            {children}
          </div>
          <ScrollRestoration />
          <Scripts />
        </AppKitProvider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
