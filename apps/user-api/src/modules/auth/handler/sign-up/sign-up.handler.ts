import { Injectable } from '@nestjs/common'
import { MemberApi } from '@libs/features/member/api/member.api'
import { SignUpDto } from './sign-up.dto'

@Injectable()
export class SignUpHandler {

  constructor(
    private readonly memberApi: MemberApi,
    private readonly authApi: AuthApi,
  ) {}

  async execute(
    dto: SignUpDto,
  ) {

    const member = await this.memberApi.register(
      dto.email,
      dto.nickname,
      dto.password,
    )

    const token = this.authApi.authenticate(member.id, {
      email: member.email,
      nickname: member.nickname,
    })


  }


}
