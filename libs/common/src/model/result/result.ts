type Ok<T> = {
  isOk: true
  isError: false
  data: T
}
type Err<E> = {
  isOk: false
  isError: true
  error: E
}
export type Result<T, E> =
  Ok<T> |
  Err<E>

export type ResultSync<T, E> =
  Promise<Result<T, E>>

export namespace Result {
  export function ok(): Ok<void>
  export function ok<T>(data: T): Ok<T>
  export function ok<T>(data?: T): Ok<T | void> {
    return {
      isOk: true,
      isError: false,
      data: data,
    };
  }

  export function err(): Err<void>
  export function err<E>(error: E): Err<E>
  export function err<E>(error?: E): Err<E | void> {
    return {
      isOk: false,
      isError: true,
      error: error,
    };
  }
}
