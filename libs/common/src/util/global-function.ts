export function assertNever(never: never): never {
  throw Error('assert never');
}
