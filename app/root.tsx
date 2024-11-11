import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import type { LinksFunction } from "@vercel/remix";
import "./tailwind.css";
import Navbar from "~/components/Navbar";
import { AppKitProvider } from "./web3modal";
import LoadingOverlay from "./components/LoadingOverlay";
import Footer from "./components/Footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Hyperminter" },
    {
      name: "description",
      content: "A tool for minting project based Hypercerts onchain.",
    },
    {
      property: "og:title",
      content: "Hyperminter",
    },
    {
      property: "og:description",
      content: "A tool for minting project based Hypercerts onchain.",
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:url",
      content: "https://hyperminter.xyz",
    },
    {
      name: "keywords",
      content:
        "hypercerts, hyperminter, impact, impactcerts, gitcoin, public goods, optimism",
    },
    {
      name: "author",
      content: "Jon Ruth, Michael Christwin",
    },
  ];
};
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
      <body style={rootStyles} className={`relative`}>
        <AppKitProvider>
          <Navbar />
          {isLoading && <LoadingOverlay />}
          <div
            className={`lg:px-[150px] md:px-[120px] px-[30px] min-h-screen h-fit w-full bg-white text-black`}
          >
            {children}
          </div>
          <ScrollRestoration />
          <Scripts />
        </AppKitProvider>
        <Footer />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
