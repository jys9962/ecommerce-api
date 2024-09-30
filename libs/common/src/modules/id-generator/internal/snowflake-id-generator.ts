/**
 * 트위터 Snowflake 참조
 */
export class SnowflakeIdGenerator {
  private static readonly NODE_ID_BIT: number = 10; // max: 1024 - 1
  private static readonly SEQUENCE_BIT: number = 12; // max: 4096 - 1

  private readonly baseTimeStamp: number;
  private readonly nodeId: number;

  private lastTimestamp: number = 0;
  private lastSequence: number = 0;

  constructor(
    nodeId: number,
    baseTime: Date,
  ) {
    this.nodeId = nodeId;
    this.baseTimeStamp = baseTime.getTime();
  }

  static getMaxNodeId(): number {
    return (1 << this.NODE_ID_BIT) - 1;
  }

  nextId(): bigint {
    let current = Math.max(Date.now(), this.lastTimestamp);
    if (this.sequenceIsFull(current)) {
      current += 1;
    }
    const sequence = this.lastTimestamp === current
      ? this.lastSequence + 1
      : 0;

    const result = this.createBitString({
      timestamp: current - this.baseTimeStamp,
      nodeId: this.nodeId,
      sequence: sequence,
    });

    this.lastTimestamp = current;
    this.lastSequence = sequence;

    return result;
  }

  private sequenceIsFull(current: number) {
    if (this.lastTimestamp !== current) {
      return false;
    }

    const maxSequence = this.getMaxSequence();
    return this.lastSequence >= maxSequence;
  }

  private getMaxSequence() {
    return (1 << SnowflakeIdGenerator.SEQUENCE_BIT) - 1;
  }

  private createBitString(
    param: {
      timestamp: number
      nodeId: number
      sequence: number
    },
  ): bigint {
    const timestampBit: bigint = BigInt(param.timestamp) << BigInt(SnowflakeIdGenerator.NODE_ID_BIT
                                                                   + SnowflakeIdGenerator.SEQUENCE_BIT);
    const nodeIdBit: bigint = BigInt(param.nodeId) << BigInt(SnowflakeIdGenerator.SEQUENCE_BIT);
    const sequenceBit: bigint = BigInt(param.sequence);

    return timestampBit | nodeIdBit | sequenceBit;
  }
}
