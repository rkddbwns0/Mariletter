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
    return result;
  }
}
