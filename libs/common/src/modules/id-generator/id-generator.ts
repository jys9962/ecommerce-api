import { SnowflakeIdGenerator } from '@libs/common/modules/id-generator/internal/snowflake-id-generator';

export class IdGenerator {
  private static generator: SnowflakeIdGenerator;

  static init(
    nodeId: number,
    baseTime: Date,
  ) {
    this.generator = new SnowflakeIdGenerator(nodeId, baseTime);
  }

  static getMaxNodeId() {
    return SnowflakeIdGenerator.getMaxNodeId();
  }

  static nextId(): string {
    if (!this.generator && process.env.NODE_ENV === 'test') {
      this.generator = new SnowflakeIdGenerator(1, new Date());
    }

    if (!this.generator) {
      throw Error('no init');
    }

    return this.generator
      .nextId()
      .toString();
  }
}
