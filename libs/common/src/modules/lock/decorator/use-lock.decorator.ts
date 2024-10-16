import { SetMetadata } from '@nestjs/common'


export function UseLock<Method extends (...args: any) => any>(
  option: UseLock.Option<Method>,
): MethodDecorator {
  return SetMetadata(UseLock.key, option)
}


export namespace UseLock {
  export const key = Symbol('lock')

  export type Option<Method extends (...args: any) => any> = {
    name: (args: Parameters<Method>) => string,
    timeout?: number,
  }
}
