import { MemberPoint } from '@libs/features/point/domain/member-point';

export abstract class MemberPointRepository {

  abstract find(
    memberId: string,
  ): Promise<MemberPoint>

  abstract save(
    memberId: string,
    memberPoint: MemberPoint,
  ): Promise<void>

}
