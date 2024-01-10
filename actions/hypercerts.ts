import { HypercertClient, HypercertMetadata } from "@hypercerts-org/sdk";
import { TransferRestrictions, formatHypercertData } from "@hypercerts-org/sdk";
import { myChains } from "@/providers/Walletprovider";

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

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChain(chainId: number) {
  for (const chain of Object.values(myChains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
}

export const ISOToUNIX = (date: Date) => {
  const isoDateString = date.toISOString();
  const unixTimeInSeconds = Math.floor(
    new Date(isoDateString).getTime() / 1000
  );
  return unixTimeInSeconds;
};

export const isValid = (formValue: MyMetadata) => {
  return (
    formValue.name !== "" &&
    formValue.description !== "" &&
    formValue.workScope.length &&
    formValue.contributors.length &&
    formValue.rights.length &&
    formValue.workTimeframeEnd &&
    formValue.workTimeframeStart &&
    // formValue.image !== "" &&
    formValue.impactScope.length &&
    formValue.impactTimeframeEnd &&
    formValue.impactTimeframeStart &&
    formValue.version !== ""
  );
};
