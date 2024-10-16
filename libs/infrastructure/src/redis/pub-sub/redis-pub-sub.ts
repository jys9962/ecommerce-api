export abstract class RedisPubSub {

  abstract subscribe(
    channel: string,
    callback: Function,
  ): void

  abstract unsubscribe(
    channel: string,
    callback: Function,
  ): void

  abstract publish(
    channel: string,
    message: string,
  ): Promise<void>

}
