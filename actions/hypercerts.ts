import { HypercertClient, HypercertMetadata } from "@hypercerts-org/sdk";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk";
declare let window: any;

export interface MyMetadata {
  name: string;
  description: string;
  external_url?: string | undefined;
  image: string;
  version: string;
  properties?:
    | {
        trait_type: string;
        value: string;
      }[]
    | undefined;
  impactScope: string[];
  excludedImpactScope: string[];
  workScope: string[];
  excludedWorkScope: string[];
  workTimeframeStart: number;
  workTimeframeEnd: number;
  impactTimeframeStart: number;
  impactTimeframeEnd: number;
  contributors: string[];
  rights: string[];
  excludedRights: string[];
}
const nftStorageToken = process.env.NEXT_PUBLIC_NFTSTORAGE;

const walletClient = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});
export const client = new HypercertClient({
  chainId: BigInt(5), // goerli testnet
  walletClient,
  nftStorageToken,
});
//@ts-ignore

export async function MintHypercert(props: MyMetadata) {
  const { data } = formatHypercertData(props);
  const totalUnits = BigInt(10000);

  const txHash = await client.mintClaim(
    data as HypercertMetadata,
    totalUnits,
    TransferRestrictions.FromCreatorOnly
  );
  return txHash;
}
