import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonRepository<TKey, TValue> {

  private data = new Map<TKey, TValue>;

  async find(
    key: TKey,
  ): Promise<TValue | null> {
    return this.data.get(key) || null;
  }

  async save(
    key: TKey,
    value: TValue,
  ): Promise<void> {
    this.data.set(key, value);
  }

  async exists(
    key: TKey,
  ): Promise<boolean> {
    return this.data.has(key);
  }

}
