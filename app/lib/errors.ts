export class AssertionError extends Error {
  constructor(msg = "Assertion failed") {
    super(msg);
  }
}
