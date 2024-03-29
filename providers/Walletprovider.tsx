"use client";

import { AppContext } from "@/context/appContext";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import {
  arbitrum,
  fantom,
  pgn,
  mainnet,
  optimism,
  sepolia,
  polygon,
} from "viem/chains";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const metadata = {
  name: "Hyperminter",
  description: "A tool for minting project based Hypercerts onchain.",
  url: "https://hyperminter.xyz",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    defaultChainId: 10,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: "...", // used for the Coinbase SDK
  }),
  chains: [
    {
      ...sepolia,
      rpcUrl: sepolia.rpcUrls.default.http[0],
      explorerUrl: sepolia.blockExplorers.default.url,
      chainId: sepolia.id,
      currency: sepolia.nativeCurrency.symbol,
    },
    {
      ...optimism,
      rpcUrl: optimism.rpcUrls.default.http[0],
      explorerUrl: optimism.blockExplorers.default.url,
      chainId: optimism.id,
      currency: optimism.nativeCurrency.symbol,
    },

    {
      ...arbitrum,
      rpcUrl: arbitrum.rpcUrls.default.http[0],
      explorerUrl: arbitrum.blockExplorers.default.url,
      chainId: arbitrum.id,
      currency: arbitrum.nativeCurrency.symbol,
    },
    {
      ...fantom,
      rpcUrl: fantom.rpcUrls.default.http[0],
      explorerUrl: fantom.blockExplorers.default.url,
      chainId: fantom.id,
      currency: fantom.nativeCurrency.symbol,
    },
    {
      ...pgn,
      rpcUrl: pgn.rpcUrls.default.http[0],
      explorerUrl: pgn.blockExplorers.default.url,
      chainId: pgn.id,
      currency: pgn.nativeCurrency.symbol,
    },
    {
      ...mainnet,
      rpcUrl: mainnet.rpcUrls.default.http[0],
      explorerUrl: mainnet.blockExplorers.default.url,
      chainId: mainnet.id,
      currency: mainnet.nativeCurrency.symbol,
    },
    {
      ...polygon,
      rpcUrl: polygon.rpcUrls.default.http[0],
      explorerUrl: polygon.blockExplorers.default.url,
      chainId: polygon.id,
      currency: polygon.nativeCurrency.symbol,
    },
  ],
  projectId,
  themeMode: "light",
  themeVariables: {
    "--w3m-accent": "#3a59ef",
    "--w3m-font-size-master": "18",
    // "--w3m-color-mix": "#000000",
    // "--w3m-color-mix-strength": 40,
  },
});

function WalletProvider({ children }: { children: React.ReactNode }) {
  return <AppContext>{children}</AppContext>;
}

export default WalletProvider;
export const myChains = {
  arbitrum,
  fantom,
  pgn,
  mainnet,
  sepolia,
  optimism,
  polygon,
};
