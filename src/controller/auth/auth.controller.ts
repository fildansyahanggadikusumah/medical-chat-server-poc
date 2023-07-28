import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from 'src/service/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body) {
    const { fullName, username, password} = body;

    const result = await this.authService.signup(fullName, username, password);

    return result;
  }

  @Post('signup-doctor')
  async signupDoctor(@Body() body) {
    const { fullName, username, password} = body;

    const result = await this.authService.signupDoctor(fullName, username, password);

    return result;
  }

  @Post('login')
  async login(@Body() body) {
    const { username, password } = body;

    const result = await this.authService.login(username, password);

    return result;
  }
}
