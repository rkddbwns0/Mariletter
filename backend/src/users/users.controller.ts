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
import { CreateUserDto, FindUserDto } from 'src/dto/users.dto';

@Controller('/users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUsers(@Body() createUser: CreateUserDto) {
    return this.userService.createUsers(createUser);
  }

  @Get()
  async dupEmail(@Query('email') email: string) {
    const result = await this.userService.dupEmail(email);
    return result;
  }

  @Get('find')
  async findUser(@Query() findUserDto: FindUserDto) {
    const result = await this.userService.findUser(findUserDto);
    return result;
  }
}
