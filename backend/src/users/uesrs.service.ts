import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto, FindUserDto } from 'src/dto/users.dto';
import { UsersEntity } from 'src/entites/users.entites';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly users: Repository<UsersEntity>,
  ) {}

  async createUsers(createUser: CreateUserDto): Promise<any> {
    try {
      const user = await this.users.findOne({
        where: { email: createUser.email },
      });
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
        console.error(e);
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
    try {
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
        throw new HttpException(
          '이미 가입된 이메일입니다.',
          HttpStatus.CONFLICT,
        );
      }

      return { avalidate: true };
    } catch (e) {
      if (e instanceof HttpException) {
        console.error(e);
        throw e;
      }
    }
  }

  async findUser(findUser: FindUserDto) {
    try {
      const findEmail = await this.users.findOne({
        where: { name: findUser.name, phone: findUser.phone },
        select: ['email'],
      });

      const findPassword = await this.users.findOne({
        where: {
          name: findUser.name,
          phone: findUser.phone,
          email: findUser.email,
        },
        select: ['user_id'],
      });

      const result = findUser.email ? findPassword : findEmail;
      if (!result) {
        throw new HttpException(
          '가입된 회원이 아닙니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      return result;
    } catch (e) {
      if (e instanceof HttpException) {
        console.error(e);
        throw e;
      }
    }
  }

  async changePassword(user_id: number, password: string) {
    try {
      const user = await this.users.findOne({
        where: { user_id: user_id },
        select: ['password'],
      });
      if (!user) {
        throw new HttpException('잘못된 사용자입니다.', HttpStatus.BAD_REQUEST);
      }

      if (bcrypt.compareSync(password, user.password)) {
        throw new HttpException(
          '이미 사용 중인 비밀번호입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPassword = this.hashPassword(password);
      await this.users.update(user_id, { password: hashPassword });
      return { message: '비밀번호가 변경되었습니다.' };
    } catch (e) {
      if (e instanceof HttpException) {
        console.error(e);
        throw e;
      }
    }
  }
}
