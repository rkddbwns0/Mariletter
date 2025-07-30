import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const login = await this.authService.login(loginDto);
    if (!login) {
      return {
        message: '로그인에 실패했습니다.',
      };
    }
    return {
      access_token: login.access_token,
      refresh_token: login.refresh_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Request() req) {
    const logout = await this.authService.logout(req.user.user_id);
    if (logout === true) {
      return {
        message: '로그아웃 되었습니다.',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    return req.user;
  }
}
