export abstract class StockRepository {

  abstract find(
    code: string,
  ): Promise<number | null>

  abstract save(
    code: string,
    quantity: number,
  ): Promise<void>

  abstract delete(
    code: string,
  ): Promise<void>
}
