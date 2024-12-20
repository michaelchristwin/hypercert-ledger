import { assertNever } from "./common";
//@ts-expect-error""Needs type declarations"
import _ from "lodash";

/**
 * Takes a string and splits into a list of strings
 * - Currently only works on ',' and new lines
 * @param input
 * @param opts.lowercase "all" if lowercase everything, "addresses" if only valid addresses
 * @param opts.deduplicate remove duplicate items. This happens after lowercasing.
 * @returns
 */
export const parseListFromString = (
  input: string,
  opts?: {
    lowercase?: "all" | "addresses";
    deduplicate?: boolean;
  }
) => {
  let list = input
    // Split on either new lines or commas
    .split(/[,\n]/)
    // Cleanup
    .map((i) => i.trim())
    // Filter out non-truthy values
    .filter((i) => !!i);
  if (opts?.lowercase) {
    switch (opts.lowercase) {
      case "all":
        list = list.map((x) => x.toLowerCase());
        break;
      case "addresses":
        list = list.map((x) =>
          x.match(/^0x[a-fA-F0-9]{40}$/) ? x.toLowerCase() : x
        );
        break;
      default:
        assertNever(opts.lowercase);
    }
  }
  if (opts?.deduplicate) {
    list = _.uniq(list);
  }
  return list;
};
