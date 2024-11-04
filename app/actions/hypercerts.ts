import {
  HypercertClient,
  TransferRestrictions,
  AllowlistEntry,
  HypercertMinterAbi,
  parseAllowListEntriesToMerkleTree,
  formatHypercertData,
} from "@hypercerts-org/sdk";
import { config, ProjectChains } from "~/web3modal";
import { parseEventLogs, decodeEventLog } from "viem";
import {
  waitForTransactionReceipt,
  getAccount,
  WaitForTransactionReceiptReturnType,
} from "@wagmi/core";
import { TOTAL_UNITS } from "~/utils/mint-utils";

// Client-side minting function that interacts with web3
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
export async function mintHypercert(
  props: MyMetadata,
  client: HypercertClient,
  allowList: AllowlistEntry[]
) {
  const { data, errors } = formatHypercertData(props);

  const res = {
    claimsTxHash: undefined as `0x${string}` | undefined,
    allowlistTxHash: undefined as `0x${string}` | undefined,
  };

  try {
    if (client === undefined) {
      throw new Error("Client is undefined");
    }
    if (!data) {
      throw errors;
    }

    console.log("Create allowlist");
    res.allowlistTxHash = await client.createAllowlist(
      allowList,
      data,
      BigInt(TOTAL_UNITS),
      TransferRestrictions.FromCreatorOnly
    );

    if (!res.allowlistTxHash) {
      throw new Error("Method Failed");
    }

    const receipt = await waitForTransactionReceipt(config, {
      hash: res.allowlistTxHash,
    });

    const logs = parseLog(receipt);
    const { address } = getAccount(config);
    const details = decodeEventLog({
      abi: HypercertMinterAbi,
      data: logs[0].data,
      topics: logs[0].topics,
    });

    if (!details.args) {
      throw new Error("details.args is undefined");
    }
    //@ts-ignore
    const claim_Id = details.args.claimID;

    const tree = parseAllowListEntriesToMerkleTree(allowList);
    let defArgs;

    for (const [leaf, value] of tree.entries()) {
      if (value[0] === address) {
        defArgs = {
          proofs: tree.getProof(leaf),
          units: BigInt(value[1]),
          claimId: claim_Id,
        };
        break;
      }
    }

    if (!defArgs) {
      throw new Error("Arguments are undefined");
    }

    const { proofs, units, claimId } = defArgs;
    const tx = await client.mintClaimFractionFromAllowlist(
      claimId,
      units,
      proofs as `0x${string}`[] | Uint8Array[]
    );

    if (!tx) {
      throw new Error("Mint claim fraction failed");
    }

    const secondReciept = await waitForTransactionReceipt(config, {
      hash: tx,
    });

    if (secondReciept.status === "reverted") {
      throw new Error("Transaction reverted");
    }

    res.claimsTxHash = tx;
  } catch (err) {
    throw err;
  }

  return res;
}

function parseLog(receipt: WaitForTransactionReceiptReturnType) {
  const logs = parseEventLogs({
    abi: HypercertMinterAbi,
    eventName: "ClaimStored",
    logs: receipt.logs as any,
  });
  return logs;
}

export function getChain(chainId: number) {
  for (const chain of Object.values(ProjectChains)) {
    if (chain.id === chainId) {
      return chain;
    }
  }
  throw new Error(`Chain with id ${chainId} not found`);
}
export const ISOToUNIX = (date: Date) => {
  return Math.floor(new Date(date.toISOString()).getTime() / 1000);
};

export const isValid = (formValue: MyMetadata) => {
  try {
    const values = [
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

    const isValid = values.every((item) => item);

    if (!isValid) {
      const invalidProperty =
        Object.keys(formValue)[values.findIndex((item) => !item)];
      throw new Error(`${invalidProperty} is invalid`);
    }

    return isValid;
  } catch (err) {
    console.error("Validation Error", err);
    throw err;
  }
};
