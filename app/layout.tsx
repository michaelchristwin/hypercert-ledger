import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { headers } from "next/headers";
import { Metadata } from "next";
import ContextProvider from "@/context";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyperminter",
  description: "A tool for minting project based Hypercerts onchain.",
  applicationName: "Hperminter",
  authors: [
    { name: "Michael Christwin", url: "https://github.com/michaelchristwin" },
  ],
  generator: "Next.js",
  keywords: [
    "hypercerts",
    "hyperminter",
    "impact",
    "impactcerts",
    "gitcoin",
    "public goods",
    "optimism",
  ],
  publisher: "Michael Christwin",
  openGraph: {
    type: "website",
    title: "Hyperminter",
    url: "https://hyperminter.xyz",
    description: "A tool for minting project based Hypercerts onchain.",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookies = (await headers()).get("cookie");
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative nico bg-cover min-h-[100vh] flex flex-col`}
      >
        <ContextProvider cookies={cookies}>
          <Toaster />
          <Navbar />
          {/* <div
            className={`fixed top-[90px] left-0 h-[35px] z-[24] text-white bg-blue-500 flex w-full text-center justify-center items-center`}
          >
            The minter is temporarily down for maintenance!
          </div> */}
          <div>{children}</div>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}

// {
//   showLoading ? (
//     <div
//       className={`fixed top-0 left-0 h-[300px] w-full
//         transition-all duration-300 pointer-events-none
//         z-30 dark:h-[200px] dark:!bg-white/10 dark:rounded-[100%] ${
//           isLoading
//             ? "delay-0 opacity-1 -translate-y-1/2"
//             : "delay-300 opacity-0 -translate-y-full"
//         }`}
//       style={{
//         background: `radial-gradient(closest-side, rgba(0,10,40,0.2) 0%, rgba(0,0,0,0) 100%)`,
//       }}
//     >
//       <div
//         className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[30px] p-2 bg-white/80 dark:bg-gray-800
//         rounded-lg shadow-lg`}
//       >
//         <CgSpinner className="text-3xl animate-spin" />
//       </div>
//     </div>
//   ) : null;
// }
