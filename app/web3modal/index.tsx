import { createAppKit } from "@reown/appkit/react";
import { http, WagmiProvider } from "wagmi";
import { arbitrum, optimism, sepolia, celo } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.reown.com
const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error("Project ID is not defined");
}

// 2. Create a metadata object - optional
const metadata = {
  name: "Hyperminter",
  description: "A tool for minting project based Hypercerts onchain.",
  url: "https://hyperminter.xyz",
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

// 3. Set the networks
const networks = [sepolia, optimism];

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: true,
  transports: [http()],
});
export const ProjectChains = { arbitrum, celo, sepolia, optimism };
export const config = wagmiAdapter.wagmiConfig;
// 5. Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks: [optimism, sepolia],
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

export function AppKitProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
