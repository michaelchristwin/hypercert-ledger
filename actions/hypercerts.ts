import {
  HypercertClient,
  TransferRestrictions,
  formatHypercertData,
  AllowlistEntry,
  HypercertMinterAbi,
  parseAllowListEntriesToMerkleTree,
} from "@hypercerts-org/sdk";
import { ProjectChains, config } from "@/config";
import { parseEventLogs, decodeEventLog } from "viem";
import {
  waitForTransactionReceipt,
  getAccount,
  WaitForTransactionReceiptReturnType,
} from "@wagmi/core";
import { TOTAL_UNITS } from "@/utils/mint-utils";

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

async function mintHypercert(
  props: MyMetadata,
  client: HypercertClient,
  allowList: AllowlistEntry[]
) {
  const { data, errors } = formatHypercertData(props);

  const res: {
    claimsTxHash: `0x${string}` | undefined;
    allowlistTxHash: `0x${string}` | undefined;
  } = {
    claimsTxHash: undefined,
    allowlistTxHash: undefined,
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
    console.log(String(logs[0].topics[1]));
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
    // StandardMerkleTree.load(JSON.parse(treeResponse as string));
    // console.log("tree:", tree);
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
    //console.log("defArgs:", defArgs);
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

export { mintHypercert, type MyMetadata };

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
export function getChain(chainId: number) {
  for (const chain of Object.values(ProjectChains)) {
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
      console.error(`${invalidProperty} is invalid`);
      throw new Error(`${invalidProperty} is invalid`);
    } else return isValid;
    // If no errors were thrown, all values in genco are truthy
  } catch (err) {
    console.error("Validation Error", err);
  }
};

function parseLog(receipt: WaitForTransactionReceiptReturnType) {
  const logs = parseEventLogs({
    abi: HypercertMinterAbi,
    eventName: "ClaimStored",
    logs: receipt.logs as any,
  });

  return logs;
}
