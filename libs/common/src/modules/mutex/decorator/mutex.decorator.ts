import { SetMetadata } from '@nestjs/common'


export function Mutex<Method extends (...args: any) => any>(
  option: Mutex.Option<Method>,
): MethodDecorator {
  return SetMetadata(Mutex.key, option)
}


export namespace Mutex {
  export const key = Symbol('lock')

  export type Option<Method extends (...args: any) => any> = {
    name: (args: Parameters<Method>) => string,
    timeout?: number,
    retryDelay?: number
  }
}
