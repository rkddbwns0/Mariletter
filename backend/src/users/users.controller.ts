import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './uesrs.service';
import { CreateUserDto, FindUserDto } from 'src/dto/users.dto';

@Controller('users')
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

  @Patch(':user_id')
  async changePassword(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body('password') password: string,
  ) {
    const result = await this.userService.changePassword(user_id, password);
    return result;
  }
}
