import { Injectable } from '@nestjs/common'
import { SignInDto } from './sign-in.dto'

@Injectable()
export class SignInHandler {

  async execute(
    dto: SignInDto,
  ) {

  }
}
