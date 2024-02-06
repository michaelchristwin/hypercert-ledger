import {
  HypercertClient,
  getClaimStoredDataFromTxHash,
  TransferRestrictions,
  formatHypercertData,
  AllowlistEntry,
  ParserReturnType,
} from "@hypercerts-org/sdk";
import { myChains } from "@/providers/Walletprovider";
import { createPublicClient, http, PublicClient } from "viem";

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
  totalUnits: bigint,
  chainId: number
) {
  const { data, errors, valid } = formatHypercertData(props);
  let res: {
    claims: ParserReturnType | undefined;
    txHash: `0x${string}` | undefined;
  } = {
    claims: undefined,
    txHash: undefined,
  };
  let currentChain = getChain(chainId);

  const publicClient = createPublicClient({
    chain: currentChain,
    transport: http(),
  });
  try {
    if (client === undefined) {
      throw new Error("Client is undefined");
    }
    if (!data) {
      throw errors;
    }

    res.txHash = await client.createAllowlist(
      allowList,
      data,
      totalUnits,
      TransferRestrictions.FromCreatorOnly
    );
    if (res.txHash) {
      // res.claims = await getClaimStoredDataFromTxHash(
      //   publicClient as PublicClient,
      //   res.txHash
      // );
    } else {
      res.claims = undefined;
      throw new Error("Response is undefined");
    }
  } catch (err) {
    console.error("Mint Process Failed:", err);
  }
  return res;
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
    let genco = [
      formValue.name,
      formValue.description,
      formValue.workScope,
      formValue.contributors,
      formValue.rights,
      formValue.workTimeframeEnd,
      formValue.workTimeframeStart,
      formValue.impactScope.length,
      formValue.impactTimeframeEnd,
      formValue.impactTimeframeStart,
      formValue.version,
    ];

    const isValid = genco.every((item) => item);

    if (!isValid) {
      const invalidProperty =
        Object.keys(formValue)[genco.findIndex((item) => !item)];
      throw new Error(`${invalidProperty} is invalid`);
    } else return isValid;
    // If no errors were thrown, all values in genco are truthy
  } catch (err) {
    console.error("Validation Error", err);
  }
};
