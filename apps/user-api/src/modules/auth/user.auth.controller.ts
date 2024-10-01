import { Body, Controller, Get, Post } from '@nestjs/common'
import { SignInDto } from './handler/sign-in/sign-in.dto'

@Controller('members')
export class UserAuthController {
  constructor() {}

  @Post('sign-up')
  // fixture 와 함께 swagger 사용하기
  async signUp() {
  }

  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
  ) {

  }

  @Post('sign-out')
  async signOut() {

  }

  @Get('profile')
  async getProfile() {

  }
}
