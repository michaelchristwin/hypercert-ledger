import { HypercertClient, HypercertMetadata } from "@hypercerts-org/sdk";
import { createWalletClient, custom } from "viem";
import { goerli } from "viem/chains";
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk";
import { Provider } from "ethers";

interface MyMetadata {
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

async function MintHypercert(props: MyMetadata, client: HypercertClient) {
  const { data } = formatHypercertData(props);
  const totalUnits = BigInt(10000);

  let txHash;
  if (client !== undefined) {
    try {
      txHash = await client.mintClaim(
        data as HypercertMetadata,
        totalUnits,
        TransferRestrictions.FromCreatorOnly
      );
    } catch (err) {
      console.error("Mint Process Failed:", err);
    }
  } else {
    console.error("Client is undefined");
  }
  return txHash;
}

export { MintHypercert, type MyMetadata };
