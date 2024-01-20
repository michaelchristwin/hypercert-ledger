import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import WalletProvider from "../providers/Walletprovider";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/Footer";

const inter = Raleway({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hyperminter",
  description: "A tool for minting project based HyperCerts onchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative nico bg-cover`}>
        <WalletProvider>
          <Toaster />
          <Navbar />
          <div className={`mt-[100px] min-h-[80vh]`}>{children}</div>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
