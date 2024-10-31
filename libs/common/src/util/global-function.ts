export function assertNever(never?: never): never {
  throw Error('assert never');
}


export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(undefined), ms);
  });
}
