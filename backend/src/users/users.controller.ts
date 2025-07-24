import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './uesrs.service';
import { CreateUser } from 'src/dto/users.dto';
import { LoginDto } from 'src/dto/auth.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUsers(@Body() createUser: CreateUser) {
    return this.userService.createUsers(createUser);
  }

  @Get()
  async dupEmail(@Query('email') email: string) {
    const result = await this.userService.dupEmail(email);
    console.log(result);
    return result;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const login = await this.userService.login(loginDto);
    return {
      access_token: login.access_token,
      refresh_token: login.refresh_token,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req) {
    console.log(req.user);
    return req.user;
  }
}
