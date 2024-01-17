import { HypercertClient, HypercertMetadata } from "@hypercerts-org/sdk";
import {
  TransferRestrictions,
  formatHypercertData,
  AllowlistEntry,
} from "@hypercerts-org/sdk";
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

async function MintHypercert(
  props: MyMetadata,
  client: HypercertClient,
  allowList: AllowlistEntry[],
  totalUnits: bigint
) {
  const { data, errors, valid } = formatHypercertData(props);
  console.log("on totalUnits", totalUnits);
  let txHash;
  try {
    if (client === undefined) {
      throw new Error("Client is undefined");
    }
    if (!data) {
      throw errors;
    }
    txHash = await client.createAllowlist(
      allowList,
      data,
      totalUnits,
      TransferRestrictions.FromCreatorOnly
    );

    // await client.mintClaim(
    //   data as HypercertMetadata,
    //   totalUnits,

    //   TransferRestrictions.FromCreatorOnly
    // );
  } catch (err) {
    console.error("Mint Process Failed:", err);
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
  try {
    if (
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
    ) {
      return true;
    } else {
      throw new Error("Fill all required input fields");
    }
  } catch (err) {
    console.error("Validation Error", err);
    throw err;
  }
};
