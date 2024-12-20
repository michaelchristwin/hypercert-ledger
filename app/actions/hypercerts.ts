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
import useProgressStore from "~/context/progress-store";
import {
  waitForTransactionReceipt,
  getAccount,
  WaitForTransactionReceiptReturnType,
} from "@wagmi/core";
import { TOTAL_UNITS } from "~/utils/mint-utils";

type Result<T, E = Error> = [E, null] | [null, T];

export interface HypercertMetadata {
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
  props: HypercertMetadata,
  client: HypercertClient,
  allowList: AllowlistEntry[]
): Promise<
  Result<{
    claimsTxHash: `0x${string}` | undefined;
    allowlistTxHash: `0x${string}` | undefined;
  }>
> {
  const updateOperationStatus =
    useProgressStore.getState().updateOperationStatus;
  const setCurrentStep = useProgressStore.getState().setCurrentStep;
  const { data, errors } = formatHypercertData(props);
  const setTxHash = useProgressStore.getState().setTxHash;
  const res = {
    claimsTxHash: undefined as `0x${string}` | undefined,
    allowlistTxHash: undefined as `0x${string}` | undefined,
  };
  if (!data) {
    updateOperationStatus("1", "error");
    return [new Error("Metadata is null", { cause: errors }), null];
  }
  updateOperationStatus("1", "success");
  console.log("Create allowlist");
  setCurrentStep("2");
  updateOperationStatus("2", "loading");
  res.allowlistTxHash = await client.createAllowlist(
    allowList,
    data,
    BigInt(TOTAL_UNITS),
    TransferRestrictions.FromCreatorOnly
  );
  if (!res.allowlistTxHash) {
    updateOperationStatus("2", "error");
    return [new Error("Failed to create allowlist"), null];
  }
  updateOperationStatus("2", "success");
  setCurrentStep("3");
  updateOperationStatus("3", "loading");
  const receipt = await waitForTransactionReceipt(config, {
    hash: res.allowlistTxHash,
  });
  if (receipt.status === "reverted") {
    updateOperationStatus("3", "error");
    return [new Error("Create allowlist transaction reverted"), null];
  }
  updateOperationStatus("3", "success");
  setCurrentStep("4");
  updateOperationStatus("4", "loading");
  const logs = parseLog(receipt);
  const { address } = getAccount(config);
  const details = decodeEventLog({
    abi: HypercertMinterAbi,
    data: logs[0].data,
    topics: logs[0].topics,
  });

  if (!details.args) {
    return [new Error("details.args is undefined"), null];
  }
  //@ts-expect-error"lol"
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
    updateOperationStatus("4", "error");
    return [new Error("Arguments are undefined"), null];
  }
  const { proofs, units, claimId } = defArgs;
  const tx = await client.mintClaimFractionFromAllowlist(
    claimId,
    units,
    proofs as `0x${string}`[] | Uint8Array[]
  );

  if (!tx) {
    updateOperationStatus("4", "error");
    return [new Error("Failed to mint claim"), null];
  }
  updateOperationStatus("4", "success");
  setCurrentStep("5");
  updateOperationStatus("5", "loading");
  const secondReciept = await waitForTransactionReceipt(config, {
    hash: tx,
  });

  if (secondReciept.status === "reverted") {
    updateOperationStatus("5", "error");
    return [new Error("Mint claim transaction reverted"), null];
  }
  updateOperationStatus("5", "success");
  res.claimsTxHash = tx;
  setTxHash(tx);

  return [null, res];
}

function parseLog(receipt: WaitForTransactionReceiptReturnType) {
  const logs = parseEventLogs({
    abi: HypercertMinterAbi,
    eventName: "ClaimStored",
    logs: receipt.logs,
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
