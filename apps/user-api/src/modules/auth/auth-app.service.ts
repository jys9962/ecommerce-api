import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthAppService {
  constructor() {}

  async signUp(
    email: string,
    nickname: string,
    password: string,
  ) {


  }
}


