import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthAppService } from './auth-app.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('members')
export class UserAuthController {
  constructor(private readonly memberService: AuthAppService) {}

  @Post('sign-up')
  // fixture 와 함께 swagger 사용하기
  async signUp(
    @Body() dto: SignUpDto,
  ) {
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
