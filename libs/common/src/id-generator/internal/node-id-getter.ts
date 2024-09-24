import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class NodeIdGetter {

  constructor(
    private readonly redis: Redis,
    private readonly maxNodeId: number,
  ) {
  }

  async get() {
    const key = 'nodeId';
    const nodeId = await this.redis.incr(key) - 1;

    if (nodeId % (this.maxNodeId + 1) === 0) {
      const overflow = nodeId - (this.maxNodeId + 1)
      await this.redis.decrby(key, overflow);
    }
    return nodeId % (this.maxNodeId + 1);
  }
}
