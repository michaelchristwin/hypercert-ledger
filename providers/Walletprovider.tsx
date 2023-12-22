"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const metadata = {
  name: "My Website",
  description: "My Website description",
  url: "https://mywebsite.com",
  icons: ["https://avatars.mywebsite.com/"],
};

const goerli = {
  name: "Goerli",
  chainId: 5,
  currency: "ETH",
  explorerUrl: "https://goerli.etherscan.io",
  rpcUrl: "https://rpc.ankr.com/eth_goerli",
};

createWeb3Modal({
  ethersConfig: defaultConfig({
    metadata,
    defaultChainId: 5,
    enableEIP6963: true,
    enableInjected: true,
    enableCoinbase: true,
    rpcUrl: "...", // used for the Coinbase SDK
  }),
  chains: [goerli],
  projectId,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#313754",
    "--w3m-font-size-master": "18",
  },
});

function WalletProvider({ children }: { children: React.ReactNode }) {
  return children;
}

export default WalletProvider;
