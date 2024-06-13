import {
  HypercertClient,
  TransferRestrictions,
  formatHypercertData,
  AllowlistEntry,
  HypercertMinterAbi,
  parseAllowListEntriesToMerkleTree,
} from "@hypercerts-org/sdk";
import { myChains } from "@/providers/Walletprovider";
import { parseEventLogs } from "viem";
import { Eip1193Provider, TransactionReceipt } from "ethers";
import { BrowserProvider, Interface } from "ethers";

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
  allowList: AllowlistEntry[],
  totalUnits: bigint,
  chainId: number,
  walletProvider: Eip1193Provider
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
    //console.log("on the other side:", data.image);
    res.allowlistTxHash = await client.createAllowlist(
      allowList,
      data,
      totalUnits,
      TransferRestrictions.FromCreatorOnly
    );
    const provider = new BrowserProvider(walletProvider);

    if (!res.allowlistTxHash) {
      throw new Error("Method Failed");
    }
    const receipt = await provider.waitForTransaction(res.allowlistTxHash);

    const logs = parseLog(receipt as TransactionReceipt);
    console.log(String(logs[0].topics[1]));
    const address = (await provider.getSigner()).address;
    const hyperInterface = new Interface(HypercertMinterAbi);
    const details = hyperInterface.parseLog(logs[0]);
    if (details) {
      const claim_Id = details.args[0].valueOf();

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
      const secondReciept = await provider.waitForTransaction(tx as string);
      if (secondReciept?.status === 0) {
        throw new Error("Transaction reverted");
      }
      res.claimsTxHash = tx;
    }
  } catch (err) {
    console.error("Mint process failed", { cause: err });
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
    } else return isValid;
    // If no errors were thrown, all values in genco are truthy
  } catch (err) {
    console.error("Validation Error", err);
  }
};

function parseLog(receipt: TransactionReceipt) {
  const logs = parseEventLogs({
    abi: HypercertMinterAbi,
    eventName: "ClaimStored",
    logs: receipt.logs as any,
  });

  return logs;
}
