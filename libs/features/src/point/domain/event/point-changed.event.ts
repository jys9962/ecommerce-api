export class PointChangedEvent {
  readonly memberId!: string;
  readonly balance!: number;
  readonly changedAt!: Date;

  static create(args: PointChangedEvent) {
    return Object.assign(
      new PointChangedEvent(),
      args,
    );
  }
}
