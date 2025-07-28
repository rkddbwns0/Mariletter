import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUser } from 'src/dto/users.dto';
import { UsersEntity } from 'src/entites/users.entites';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenEntity } from 'src/entites/token.entits';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  async createUsers(createUser: CreateUser): Promise<any> {
    try {
      const user = await this.users.findOne({
        where: { email: createUser.email },
      });
      console.log(user);
      if (user) {
        throw new HttpException(
          '이미 가입된 사용자입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = this.hashPassword(createUser.password);
      const newUser = this.users.create({
        ...createUser,
        password: hashPassword,
      });
      await this.users.save(newUser);
      return { message: '회원가입이 완료되었습니다.', user: newUser };
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
    }
  }

  private hashPassword(password: string) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      return hash;
    } catch (e) {
      throw new Error(e);
    }
  }

  async dupEmail(email: string) {
    const regexp = new RegExp(
      '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    );

    if (!regexp.test(email)) {
      throw new HttpException(
        '이메일 형식에 맞지 않습니다.',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.users.findOne({ where: { email } });
    console.log(user);
    if (user) {
      throw new HttpException('이미 가입된 이메일입니다.', HttpStatus.CONFLICT);
    }

    return { avalidate: true };
  }
}
