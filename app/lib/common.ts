import { AssertionError } from "./errors";

export function assertNever(_x: never): never {
  throw new AssertionError("Unexpected branch taken");
}
